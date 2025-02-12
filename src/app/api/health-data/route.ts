import prisma, {Prisma} from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

import fs from 'fs'
import {parseHealthData} from "@/lib/health-data/parser/pdf";
import crypto from "node:crypto";
import {fileTypeFromBuffer} from "file-type";
import gm from "gm";

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
    const contentType = req.headers.get('content-type')
    if (!contentType) {
        return NextResponse.json({error: 'Missing content-type header'}, {status: 400})
    }

    if (contentType === 'application/json') {
        const data: HealthDataCreateRequest = await req.json()
        const healthData = await prisma.healthData.create({
            data
        })
        return NextResponse.json<HealthDataCreateResponse>(healthData)
    } else {
        const formData = await req.formData()
        const file = formData.get('file')
        const visionParser = formData.get('visionParser')
        const visionParserModel = formData.get('visionParserModel')
        const visionParserApiKey = formData.get('visionParserApiKey')

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
                const imageMagick = gm.subClass({imageMagick: true});
                const outputBuffer = await new Promise<Buffer>((resolve, reject) => {
                    imageMagick(fileBuffer)
                        .toBuffer('PNG', (err, buffer) => {
                            if (err) reject(err);
                            else resolve(buffer);
                        });
                });
                const filename = `${fileHash}.png`;
                fs.writeFileSync(`./public/uploads/${filename}`, outputBuffer)
                fileType = file.type
                filePath = `/uploads/${filename}`
                baseData = {fileName: file.name}
            } else {
                const extension = file.name.split('.').pop()
                const filename = `${fileHash}.${extension}`;
                fs.writeFileSync(`./public/uploads/${filename}`, fileBuffer)
                fileType = file.type
                filePath = `/uploads/${filename}`
                baseData = {fileName: file.name}
            }
        }

        // Create parsing data
        let healthData;
        try {
            healthData = await prisma.healthData.create({
                data: {
                    type: 'FILE',
                    status: 'PARSING',
                    filePath: filePath,
                    fileType: fileType,
                    data: baseData ? {...baseData} : {}
                },
            });

            // Return initial response
            if (!file) return NextResponse.json(healthData);
            if (!(file instanceof File)) return NextResponse.json(healthData);

            // Process file
            const {data, pages, ocrResults} = await parseHealthData({
                file: `./public${filePath}`,
                visionParser: visionParser ? {
                    parser: visionParser as string,
                    model: visionParserModel as string,
                    apiKey: visionParserApiKey as string
                } : undefined
            })

            // Update health data with parsed data
            healthData = await prisma.healthData.update({
                where: {id: healthData.id},
                data: {
                    status: 'COMPLETED',
                    metadata: {
                        ocr: ocrResults[0],
                        dataPerPage: pages[0]
                    },
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
    const healthDataList = await prisma.healthData.findMany({
        orderBy: {createdAt: 'asc'}
    })
    return NextResponse.json<HealthDataListResponse>({
        healthDataList: healthDataList
    })

}
