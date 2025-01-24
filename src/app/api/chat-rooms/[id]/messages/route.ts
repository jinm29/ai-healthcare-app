import {NextRequest, NextResponse} from "next/server";
import prisma, {Prisma} from "@/lib/prisma";

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
    const messages = [
        {"role": "system", "content": assistantMode.systemPrompt},
        {
            "role": "user",
            "content": `Health data sources: ${healthDataList.map((healthData) => `${healthData.type}: ${JSON.stringify(healthData.data)}`).join('\n')}`
        },
        ...chatMessages.map((message) => ({
            role: message.role.toLowerCase(),
            content: message.content
        }))
    ]
    const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            "model": "gpt-4o-mini",
            "messages": messages,
            "stream": true
        })
    })

    // Stream the response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            if (reader) {
                let done = false;
                let messageContent = '';
                while (!done) {
                    const {value, done: isDone} = await reader.read();
                    done = isDone;

                    const rawMessage = decoder.decode(value, {stream: !done});
                    for (const streamMessage of rawMessage.split('\n').filter(Boolean)) {
                        const message = streamMessage.replace(/^data: /, "");
                        if (message === '[DONE]') {
                            await reader.cancel();
                            break;
                        }

                        const data = JSON.parse(message);
                        const deltaContent = data.choices[0].delta.content
                        if (deltaContent !== undefined) messageContent += deltaContent;

                        // Enqueue the chunk to the stream
                        controller.enqueue(encoder.encode(`${JSON.stringify({content: messageContent})}\n`));
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
                controller.close();
            } else {
                controller.close();
            }
        }
    });

    return new NextResponse(stream, {
        headers: response.headers
    });
}
