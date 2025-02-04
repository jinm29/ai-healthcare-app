import prisma, {Prisma} from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

import fs from 'fs'
import cuid from "cuid";
import {parseHealthDataFromPDF} from "@/lib/health-data/parser/pdf";

export interface HealthData {
    id: string;
    type: string;
    data: Prisma.JsonValue;
    filePath?: string | null;
    fileType?: string | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
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
        const type = formData.get('type')
        const id = formData.get('id')
        const file = formData.get('file')

        let filePath: string | undefined
        let fileType: string | undefined
        let data: { fileName: string } | undefined = undefined

        // Save files
        if (file instanceof File) {
            const filename = `${cuid()}.${file.name.split('.').pop()}`
            fs.writeFileSync(`./public/uploads/${filename}`, Buffer.from(await file.arrayBuffer()))
            fileType = file.type
            filePath = `/uploads/${filename}`
            data = {
                fileName: file.name
            }
        }

        // Create parsing data
        let healthData;
        try {
            healthData = await prisma.healthData.create({
                data: {
                    id: id as string,
                    type: type as string,
                    status: 'PARSING',
                    filePath: filePath,
                    fileType: fileType,
                    data: {
                        ...data,
                        parsingLogs: ['Started file processing...']
                    }
                },
            });

            // Return initial response
            if (!file) return NextResponse.json(healthData);

            // Process file
            const {parsed, ocr, parsingLogs} = await parseHealthDataFromPDF({file: file});

            // Update health data with parsed data
            healthData = await prisma.healthData.update({
                where: {id: id as string},
                data: {
                    status: 'COMPLETED',
                    ocrData: ocr ? JSON.parse(JSON.stringify(ocr)) : null,
                    data: {...data, ...parsed, parsingLogs}
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
                    where: {id: id as string},
                    data: {
                        status: 'COMPLETED',
                        data: {...data, parsingLogs},
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
