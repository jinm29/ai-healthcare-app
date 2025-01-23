import prisma, {Prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export interface ChatRoomListResponse {
    chatRooms: Prisma.ChatRoomGetPayload<{
        select: { id: true, name: true, createdAt: true, updatedAt: true }
    }>[]
}

export interface ChatRoomCreateResponse extends Prisma.ChatRoomGetPayload<{
    select: { id: true, name: true, createdAt: true, updatedAt: true },
}> {
    id: string
}

export async function GET() {
    const chatRooms = await prisma.chatRoom.findMany({
        orderBy: {updatedAt: 'desc'},
    })
    return NextResponse.json<ChatRoomListResponse>({
        chatRooms
    })
}

export async function POST() {
    const chatRoom = await prisma.chatRoom.create({
        data: {
            name: 'New Chat'
        }
    })
    return NextResponse.json<ChatRoomCreateResponse>(chatRoom)
}
