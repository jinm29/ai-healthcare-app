import {NextRequest, NextResponse} from "next/server";
import prisma, {Prisma} from "@/lib/prisma";
import OpenAI from "openai";

export interface ChatMessage extends Prisma.ChatMessageGetPayload<{
    select: {
        id: true,
        content: true,
        createdAt: true,
        role: true
    }
}> {
    id: string,
}

export interface ChatMessageListResponse {
    chatMessages: ChatMessage[]
}

export interface ChatMessageCreateRequest {
    content: string,
    role: 'USER' | 'ASSISTANT'
}

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    const chatMessages = await prisma.chatMessage.findMany({
        where: {chatRoomId: id},
        orderBy: {createdAt: 'asc'}
    });

    return NextResponse.json<ChatMessageListResponse>({chatMessages})
}

export async function POST(
    req: NextRequest,
    {params}: {
        params: Promise<{ id: string }>,
    }
) {
    const {id} = await params
    const body: ChatMessageCreateRequest = await req.json()

    const {assistantMode, chatMessages, healthDataList} = await prisma.$transaction(async (prisma) => {
        await prisma.chatMessage.create({data: {content: body.content, role: body.role, chatRoomId: id}});
        const {assistantMode} = await prisma.chatRoom.update({
            where: {id},
            data: {updatedAt: new Date()},
            select: {assistantMode: {select: {systemPrompt: true}}}
        })
        const chatMessages = await prisma.chatMessage.findMany({
            where: {chatRoomId: id},
            orderBy: {createdAt: 'asc'}
        })
        const healthDataList = await prisma.healthData.findMany({})
        return {
            chatMessages,
            assistantMode,
            healthDataList
        }
    })

    // api call stream
    // TODO: Select LLM provider based on settings (OpenAI, Claude, etc.)
    const messages: {
        role: 'system' | 'user' | 'assistant',
        content: string
    }[] = [
        {"role": "system", "content": assistantMode.systemPrompt},
        {
            "role": "user",
            "content": `Health data sources: ${healthDataList.map((healthData) => `${healthData.type}: ${JSON.stringify(healthData.data)}`).join('\n')}`
        },
        ...chatMessages.map((message) => ({
            role: message.role.toLowerCase() as 'user' | 'assistant',
            content: message.content
        }))
    ]
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    const chatStream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        stream: true
    });
    const responseStream = new ReadableStream({
        async start(controller) {
            let messageContent = '';
            for await (const part of chatStream) {
                const deltaContent = part.choices[0]?.delta.content
                if (deltaContent !== undefined) messageContent += deltaContent;

                controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
            }

            // Save to prisma after the stream is done
            await prisma.$transaction(async (prisma) => {
                await prisma.chatMessage.create({
                    data: {
                        content: messageContent,
                        role: 'ASSISTANT',
                        chatRoomId: id
                    }
                });
                await prisma.chatRoom.update({
                    where: {id}, data: {updatedAt: new Date(), name: messageContent}
                })
            });

            controller.close();
        }
    });

    return new NextResponse(responseStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
}
