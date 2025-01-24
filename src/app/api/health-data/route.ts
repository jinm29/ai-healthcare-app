import prisma, {Prisma} from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import OpenAI from "openai";
import {fromBuffer as pdf2picFromBuffer} from 'pdf2pic'
import fs from 'fs'
import cuid from "cuid";

export interface HealthData extends Prisma.HealthDataGetPayload<{
    select: {
        id: true,
        type: true,
        data: true,
        status: true,
        filePath: true,
        fileType: true,
        createdAt: true,
        updatedAt: true
    }
}> {
    id: string
}

export interface HealthDataCreateRequest {
    id?: string;
    type: string;
    data: Prisma.InputJsonValue;
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

        // Save files
        if (file instanceof File) {
            const filename = `${cuid()}.${file.name.split('.').pop()}`
            fs.writeFileSync(`./public/uploads/${filename}`, Buffer.from(await file.arrayBuffer()))
            fileType = file.type
            filePath = `/uploads/${filename}`
        }

        // Create parsing data
        await prisma.healthData.create({
            data: {
                id: id as string,
                type: type as string,
                status: 'PARSING',
                filePath: filePath,
                fileType: fileType,
                data: {}
            },
        })

        const messages = [
            {
                role: 'user', content: [
                    {
                        type: 'text',
                        text: 'Extract all data.\nresponse format: json'
                    },
                    ...(await Promise.all([file].map(async (file) => {
                        if (file instanceof File) {
                            if (file.type.startsWith('image')) {
                                const arrayBuffer = await file.arrayBuffer()
                                return [{
                                    type: 'image_url',
                                    image_url: {url: `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`}
                                }]
                            } else if (file.type.startsWith('application/pdf')) {
                                const messages = []
                                const pdf2picConverter = pdf2picFromBuffer(
                                    Buffer.from(await file.arrayBuffer()),
                                )
                                const images = await pdf2picConverter.bulk(-1, {responseType: 'base64'})
                                for (const image of images) {
                                    if (image.base64) messages.push({
                                        type: 'image_url',
                                        image_url: {url: `data:image/png;base64,${image.base64}`}
                                    })
                                }
                                return messages
                            }
                        }

                        return undefined
                    }))).flat().filter((message) => message !== undefined)
                ]
            },
        ]

        const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages as any,
            response_format: {
                type: 'json_object'
            }
        })
        const content = chatCompletion.choices[0].message.content
        if (content) {
            const healthData = await prisma.healthData.update({
                where: {id: id as string},
                data: {
                    type: type as string,
                    status: 'COMPLETED',
                    data: JSON.parse(content)
                }
            })
            return NextResponse.json<HealthDataCreateResponse>(healthData)
        }

        return NextResponse.json({error: 'Invalid request'}, {status: 400})
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
