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

export interface ChatRoomCreateResponse extends ChatRoom {
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
        // Get the last used chat room to get its assistant mode
        const lastChatRoom = await prisma.chatRoom.findFirst({
            orderBy: { updatedAt: 'desc' },
            select: { assistantModeId: true }
        });

        // If we have a last chat room, use its assistant mode, otherwise find the first one
        const assistantModeId = lastChatRoom?.assistantModeId || (await prisma.assistantMode.findFirstOrThrow()).id;

        return prisma.chatRoom.create({
            data: {
                name: 'New Chat',
                assistantModeId: assistantModeId
            },
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
            }
        });
    });
    return NextResponse.json<ChatRoomCreateResponse>(chatRoom);
}
