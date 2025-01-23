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

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    const chatMessages = await prisma.chatMessage.findMany({
        where: {chatRoomId: id},
        orderBy: {createdAt: 'desc'}
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
    const body: any = await req.json()
    const chatMessage = await prisma.chatMessage.create({
        data: {
            content: body.content,
            role: body.role,
            chatRoomId: id
        }
    });
    await prisma.chatRoom.update({
        where: {id},
        data: {updatedAt: new Date()}
    })
    return NextResponse.json<ChatMessage>(chatMessage)
}
