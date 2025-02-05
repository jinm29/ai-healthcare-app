import prisma, {Prisma} from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

import fs from 'fs'
import cuid from "cuid";

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
        const type = formData.get('type')
        const id = formData.get('id')
        const file = formData.get('file')

        let filePath: string | undefined
        let fileType: string | undefined
        let baseData: { fileName: string } | undefined = undefined

        // Save files
        if (file instanceof File) {
            const filename = `${cuid()}.${file.name.split('.').pop()}`
            fs.writeFileSync(`./public/uploads/${filename}`, Buffer.from(await file.arrayBuffer()))
            fileType = file.type
            filePath = `/uploads/${filename}`
            baseData = {
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
                    data: baseData ? {...baseData} : {}
                },
            });

            // Return initial response
            if (!file) return NextResponse.json(healthData);
            if (!(file instanceof File)) return NextResponse.json(healthData);

            // Process file
            const formData = new FormData();
            formData.append('files', file, file.name);
            formData.append('strategy', 'ocr_with_gpt_vision_merge')
            formData.append('user_id', '')
            formData.append('dynamic_extract_fields', 'false')
            formData.append('run_in_background', 'false')

            const response = await fetch('https://equation.zazz.buzz/api/upload/health-checkup-report', {
                method: 'POST',
                body: formData
            })
            const {data, pages, ocrResults} = await response.json();

            // Update health data with parsed data
            healthData = await prisma.healthData.update({
                where: {id: id as string},
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
                    where: {id: id as string},
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
