import prisma, {Prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export interface ChatRoom extends Prisma.ChatRoomGetPayload<{
    select: {
        id: true,
        name: true,
        assistantMode: { select: { id: true, name: true, description: true, systemPrompt: true } },
        createdAt: true,
        updatedAt: true
    }
}> {
    id: string
}

export interface ChatRoomListResponse {
    chatRooms: ChatRoom[]
}

export interface ChatRoomCreateResponse extends Prisma.ChatRoomGetPayload<{
    select: { id: true, name: true, createdAt: true, updatedAt: true },
}> {
    id: string
}

export async function GET() {
    const chatRooms = await prisma.chatRoom.findMany({
        select: {
            id: true,
            name: true,
            assistantMode: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    systemPrompt: true
                }
            },
            createdAt: true,
            updatedAt: true
        },
        orderBy: {updatedAt: 'desc'},
    })
    return NextResponse.json<ChatRoomListResponse>({
        chatRooms
    })
}

export async function POST() {
    const chatRoom = await prisma.$transaction(async (prisma) => {
        const assistantMode = await prisma.assistantMode.findFirstOrThrow();
        return prisma.chatRoom.create({
            data: {
                name: 'New Chat',
                assistantModeId: assistantMode.id
            }
        })
    })
    return NextResponse.json<ChatRoomCreateResponse>(chatRoom)
}
