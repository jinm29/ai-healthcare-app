import {redirect} from "next/navigation";
import prisma from "@/lib/prisma";
import {auth} from "@/auth";

export const dynamic = "force-dynamic";

export default async function Page() {
    const session = await auth()
    if (!session || !session.user) redirect('/login');

    let lastChatRoom = await prisma.chatRoom.findFirst({
        where: {authorId: session.user.id},
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
                authorId: session.user.id,
            }
        })
    }

    redirect(`/chat/${lastChatRoom.id}`);
}
