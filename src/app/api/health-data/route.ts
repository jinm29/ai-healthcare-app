import prisma, {Prisma} from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";
import OpenAI from "openai";

export interface HealthData extends Prisma.HealthDataGetPayload<{
    select: {
        id: true,
        type: true,
        data: true,
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
        const status = formData.get('status')
        const files = formData.getAll('files')

        const messages = [
            {
                role: 'user', content: [
                    {type: 'text', text: 'What is the status of my health data?\nresponse format: json'},
                    ...(await Promise.all(files.map(async (file) => {
                        if (file instanceof File) {
                            if (file.type.startsWith('image')) {
                                const arrayBuffer = await file.arrayBuffer()
                                return {
                                    type: 'image_url',
                                    image_url: {url: `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`}
                                }
                            } else if (file.type.startsWith('application/pdf')) {
                                return {role: 'user', content: 'I have uploaded an pdf file'}
                            }
                        }
                        return undefined
                    }))).filter((message) => message !== undefined)
                ]
            },
        ]

        const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages as any,
        })
        const content = chatCompletion.choices[0].message.content
        if (content) {
            const healthData = await prisma.healthData.create({
                data: {
                    id: id as string,
                    type: type as string,
                    status: status,
                    data: {parsed: content}
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
