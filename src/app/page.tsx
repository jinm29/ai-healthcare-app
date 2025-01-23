import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";

export default async function Page() {
    let lastChatRoom = await prisma.chatRoom.findFirst({
        orderBy: {updatedAt: 'desc'},
    })
    if (!lastChatRoom) lastChatRoom = await prisma.chatRoom.create({data: {name: 'Chat'}})

    redirect(`/chat/${lastChatRoom.id}`);
}
