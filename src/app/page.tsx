import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Page() {
    let lastChatRoom = await prisma.chatRoom.findFirst({
        orderBy: {updatedAt: 'desc'},
    })
    if (!lastChatRoom) {
        const assistantMode = await prisma.assistantMode.findFirstOrThrow()
        const llmProvider = await prisma.lLMProvider.findFirstOrThrow()
        lastChatRoom = await prisma.chatRoom.create({
            data: {
                name: 'Chat',
                assistantModeId: assistantMode.id,
                llmProviderId: llmProvider.id,
            }
        })
    }

    redirect(`/chat/${lastChatRoom.id}`);
}
