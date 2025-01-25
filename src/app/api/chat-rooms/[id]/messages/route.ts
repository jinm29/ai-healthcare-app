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
    role: 'USER' | 'ASSISTANT',
    settings?: {
        company: string,
        model: string,
        apiEndpoint: string,
        apiKey: string
    }
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

    const messages = [
        {"role": "system" as const, "content": assistantMode.systemPrompt},
        {
            "role": "user" as const,
            "content": `Health data sources: ${healthDataList.map((healthData) => `${healthData.type}: ${JSON.stringify(healthData.data)}`).join('\n')}`
        },
        ...chatMessages.map((message) => ({
            role: message.role.toLowerCase() as 'user' | 'assistant',
            content: message.content
        }))
    ]

    const responseStream = new ReadableStream({
        async start(controller) {
            let messageContent = '';

            try {
                if (body.settings?.company === 'local') {
                    // Ollama API call
                    const response = await fetch(`${body.settings.apiEndpoint}/api/chat`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: body.settings.model,
                            messages: messages,
                            stream: true,
                        }),
                    });

                    const reader = response.body?.getReader();
                    if (!reader) throw new Error('No reader available');

                    while (true) {
                        const {done, value} = await reader.read();
                        if (done) break;

                        const chunk = new TextDecoder().decode(value);
                        const lines = chunk.split('\n').filter(line => line.trim());
                        
                        for (const line of lines) {
                            if (line.includes('[DONE]')) continue;
                            try {
                                const json = JSON.parse(line);
                                const content = json.message?.content;
                                if (content) {
                                    messageContent += content;
                                    controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
                                }
                            } catch (e) {
                                console.error('Error parsing JSON:', e);
                            }
                        }
                    }
                } else {
                    // OpenAI API call (existing code)
                    const openai = new OpenAI({
                        apiKey: body.settings?.apiKey || process.env.OPENAI_API_KEY,
                    })
                    const chatStream = await openai.chat.completions.create({
                        model: "gpt-4",
                        messages: messages,
                        stream: true
                    });

                    for await (const part of chatStream) {
                        const deltaContent = part.choices[0]?.delta.content
                        if (deltaContent !== undefined) messageContent += deltaContent;
                        controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
                    }
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
            } catch (error) {
                console.error('Error in chat stream:', error);
                controller.enqueue(`${JSON.stringify({error: 'Failed to get response from LLM'})}\n`);
            }

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
