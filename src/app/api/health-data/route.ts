import prisma, {Prisma} from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import {parseHealthData} from "@/lib/health-data/parser/pdf";
import crypto from "node:crypto";
import {fileTypeFromBuffer} from "file-type";
import sharp from 'sharp'
import {auth} from "@/auth";
import {put} from "@vercel/blob";
import {currentDeploymentEnv} from "@/lib/current-deployment-env";
import fs from 'fs'

export interface HealthData extends Prisma.HealthDataGetPayload<{
    select: {
        id: true,
        type: true,
        data: true,
        metadata: true,
        status: true,
        fileType: true,
        filePath: true,
        createdAt: true,
        updatedAt: true,
    }
}> {
    id: string
}

export interface HealthDataCreateRequest {
    id?: string;
    type: string;
    data: Prisma.InputJsonValue;
    filePath?: string | null;
    fileType?: string | null;
}

export interface HealthDataListResponse {
    healthDataList: HealthData[]
}

export interface HealthDataCreateResponse extends HealthData {
    id: string;
}

export async function POST(
    req: NextRequest
) {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json({error: 'Unauthorized'}, {status: 401})

    const contentType = req.headers.get('content-type')
    if (!contentType) {
        return NextResponse.json({error: 'Missing content-type header'}, {status: 400})
    }

    if (contentType === 'application/json') {
        const data: HealthDataCreateRequest = await req.json()
        const healthData = await prisma.healthData.create({
            data: {...data, authorId: session.user.id}
        })
        return NextResponse.json<HealthDataCreateResponse>(healthData)
    } else {
        const formData = await req.formData()
        const file = formData.get('file')
        const id = formData.get('id')

        // Vision Parser
        const visionParser = formData.get('visionParser')
        const visionParserModel = formData.get('visionParserModel')
        const visionParserApiKey = formData.get('visionParserApiKey')
        const visionParserApiUrl = formData.get('visionParserApiUrl')

        // Document Parser
        const documentParser = formData.get('documentParser')
        const documentParserModel = formData.get('documentParserModel')
        const documentParserApiKey = formData.get('documentParserApiKey')

        let filePath: string | undefined
        let fileType: string | undefined
        let baseData: { fileName: string } | undefined = undefined

        // Save files
        if (file instanceof File) {
            const fileBuffer = Buffer.from(await file.arrayBuffer())
            const result = await fileTypeFromBuffer(fileBuffer)
            if (!result) return NextResponse.json({error: 'Failed to determine file type'}, {status: 400})

            // Get file hash
            const hash = crypto.createHash('md5')
            hash.update(fileBuffer)
            const fileHash = hash.digest('hex')

            const {mime} = result
            if (mime.startsWith('image/')) {
                const outputBuffer = await sharp(fileBuffer).png().toBuffer()
                const filename = `${fileHash}.png`;
                if (currentDeploymentEnv === 'local') {
                    fs.writeFileSync(`./public/uploads/${filename}`, outputBuffer)
                    filePath = `${process.env.NEXT_PUBLIC_URL}/api/static/uploads/${filename}`
                } else {
                    const blob = await put(`/uploads/${filename}`, outputBuffer, {
                        access: 'public',
                        contentType: 'image/png'
                    })
                    filePath = blob.downloadUrl
                }
                fileType = 'image/png'
                baseData = {fileName: file.name}
            } else {
                if (currentDeploymentEnv === 'local') {
                    const extension = file.name.split('.').pop()
                    const filename = `${fileHash}.${extension}`;
                    fs.writeFileSync(`./public/uploads/${filename}`, fileBuffer)
                    filePath = `${process.env.NEXT_PUBLIC_URL}/api/static/uploads/${filename}`
                } else {
                    const extension = file.name.split('.').pop()
                    const filename = `${fileHash}.${extension}`;
                    const blob = await put(`/uploads/${filename}`, fileBuffer, {
                        access: 'public',
                        contentType: mime
                    })
                    filePath = blob.downloadUrl
                }
                fileType = mime
                baseData = {fileName: file.name}
            }
        }

        // Create parsing data
        let healthData;
        try {
            healthData = await prisma.healthData.create({
                data: {
                    id: id ? id as string : undefined,
                    type: 'FILE',
                    status: 'PARSING',
                    filePath: filePath,
                    fileType: fileType,
                    data: baseData ? {...baseData} : {},
                    authorId: session.user.id,
                },
            });

            // Process file
            const {data, pages, ocrResults} = await parseHealthData({
                file: filePath as string,
                visionParser: visionParser ? {
                    parser: visionParser as string,
                    model: visionParserModel as string,
                    apiKey: visionParserApiKey as string,
                    apiUrl: visionParserApiUrl ? visionParserApiUrl as string : undefined
                } : undefined,
                documentParser: documentParser ? {
                    parser: documentParser as string,
                    model: documentParserModel as string,
                    apiKey: documentParserApiKey as string
                } : undefined
            })

            // Update health data with parsed data
            healthData = await prisma.healthData.update({
                where: {id: healthData.id},
                data: {
                    status: 'COMPLETED',
                    metadata: JSON.parse(JSON.stringify({ocr: ocrResults[0], dataPerPage: pages[0]})),
                    data: {...baseData, ...data[0]}
                }
            });
            return NextResponse.json(healthData);
        } catch (error) {
            console.error('Error processing file:', error);
            const parsingLogs: string[] = []
            parsingLogs.push(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            // If there's an error, update the health data with error logs
            if (healthData) {
                healthData = await prisma.healthData.update({
                    where: {id: healthData.id},
                    data: {
                        status: 'COMPLETED',
                        data: {...baseData, parsingLogs},
                    }
                });
                return NextResponse.json(healthData);
            }
            return NextResponse.json({error: 'Failed to process file'}, {status: 500});
        }
    }
}

export async function GET() {
    const session = await auth()
    if (!session || !session.user) return NextResponse.json({error: 'Unauthorized'}, {status: 401})

    // Create personal info if it doesn't exist
    const personalInfo = await prisma.healthData.findFirst({where: {authorId: session.user.id, type: 'PERSONAL_INFO'}})
    if (personalInfo === null) {
        await prisma.healthData.create({
            data: {type: 'PERSONAL_INFO', authorId: session.user.id, data: {}}
        })
    }

    const healthDataList = await prisma.healthData.findMany({
        where: {authorId: session.user.id},
        orderBy: {createdAt: 'asc'}
    })
    return NextResponse.json<HealthDataListResponse>({
        healthDataList: healthDataList
    })

}
