import {NextRequest, NextResponse} from "next/server";
import prisma, {Prisma} from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import {GoogleGenerativeAI} from "@google/generative-ai";
import {auth} from "@/auth";
import {decrypt} from "@/lib/encryption";
import {currentDeploymentEnv} from "@/lib/current-deployment-env";
import {ChatOpenAI} from "@langchain/openai";

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
    const session = await auth()
    const user = session?.user
    if (!session || !user) return NextResponse.json({error: 'Unauthorized'}, {status: 401})

    const {id} = await params
    const body: ChatMessageCreateRequest = await req.json()

    const {
        chatRoom,
        assistantMode,
        chatMessages,
        healthDataList,
        llmProvider
    } = await prisma.$transaction(async (prisma) => {
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
        const healthDataList = await prisma.healthData.findMany({where: {authorId: user.id}})
        const chatRoom = await prisma.chatRoom.findUniqueOrThrow({where: {id}})
        const llmProvider = await prisma.lLMProvider.findUniqueOrThrow({where: {id: chatRoom.llmProviderId}});
        return {
            chatRoom,
            chatMessages,
            assistantMode,
            healthDataList,
            llmProvider
        }
    })

    let apiKey: string
    if (currentDeploymentEnv === 'local') {
        apiKey = decrypt(llmProvider.apiKey)
    } else if (currentDeploymentEnv === 'cloud') {
        switch (llmProvider.providerId) {
            case 'openai':
                apiKey = process.env.OPENAI_API_KEY as string
                break;
            case 'anthropic':
                apiKey = process.env.ANTHROPIC_API_KEY as string
                break;
            case 'google':
                apiKey = process.env.GOOGLE_API_KEY as string
                break;
            default:
                throw new Error('Unsupported LLM provider');
        }
    }

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
                if (llmProvider.providerId === 'ollama') {
                    const response = await fetch(`${llmProvider.apiURL}/api/chat`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            model: chatRoom.llmProviderModelId,
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
                } else if (llmProvider.providerId === 'openai') {
                    // OpenAI API call
                    const llmProviderModelId = chatRoom.llmProviderModelId;
                    if (!llmProviderModelId) throw new Error('No LLM model ID provided');
                    const openai = new ChatOpenAI({
                        apiKey,
                        model: llmProviderModelId,
                        configuration: {baseURL: llmProvider.apiURL},
                        streaming: true,
                    })

                    const chatStream = await openai.stream(messages)
                    for await (const part of chatStream) {
                        const deltaContent = part.content.toString()
                        if (deltaContent !== undefined) messageContent += deltaContent;
                        controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
                    }
                } else if (llmProvider.providerId === 'anthropic') {
                    const anthropic = new Anthropic({apiKey, baseURL: llmProvider.apiURL});
                    const llmProviderModelId = chatRoom.llmProviderModelId;
                    if (!llmProviderModelId) throw new Error('No LLM model ID provided');
                    messageContent = await new Promise((resolve, reject) => {
                        let messageContent = '';
                        anthropic.messages.stream({
                            model: llmProviderModelId,
                            messages: messages
                                .filter(message => message.content)
                                .filter((message) => message.role !== 'system'),
                            system: messages
                                .filter(message => message.content)
                                .filter((message) => message.role === 'system').join('\n'),
                            max_tokens: 4096,
                            stream: true,
                        })
                            .on('text', (text) => {
                                if (text !== undefined) messageContent += text;
                                controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
                            })
                            .on('end', () => {
                                resolve(messageContent);
                            })
                            .on('error', (error) => {
                                reject(error);
                            });
                    })
                } else if (llmProvider.providerId == 'google') {
                    const gemini = new GoogleGenerativeAI(apiKey)
                    const llmProviderModelId = chatRoom.llmProviderModelId;
                    if (!llmProviderModelId) throw new Error('No LLM model ID provided');
                    const model = gemini.getGenerativeModel({model: llmProviderModelId})

                    const lastMessage = messages[messages.length - 1]
                    const history = messages.filter(message => message.role !== 'system').slice(0, -1)
                    const systemInstruction = messages.find(message => message.role === 'system')

                    const chat = model.startChat({
                        systemInstruction: systemInstruction ? {
                            role: 'system',
                            parts: [{text: systemInstruction.content}]
                        } : undefined,
                        history: history.map(message => ({
                            role: message.role === 'assistant' ? 'model' : message.role,
                            parts: [{text: message.content}]
                        })),
                    })

                    const result = await chat.sendMessageStream(lastMessage.content)
                    for await (const chunk of result.stream) {
                        if (chunk.candidates) {
                            const candidates = chunk.candidates[0]
                            messageContent += candidates.content.parts.map(part => part.text).join('')
                        } else {
                            messageContent += chunk.text
                        }
                        controller.enqueue(`${JSON.stringify({content: messageContent})}\n`);
                    }
                } else {
                    throw new Error('Unsupported LLM provider');
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
