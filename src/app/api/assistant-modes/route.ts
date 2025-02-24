import {NextResponse} from "next/server";
import prisma, {Prisma} from "@/lib/prisma";
import {auth} from "@/auth";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AssistantMode extends Prisma.AssistantModeGetPayload<{
    select: { id: true, name: true, description: true, systemPrompt: true }
}> {
}

export interface AssistantModeListResponse {
    assistantModes: AssistantMode[]
}

export async function GET() {
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const assistantModes = await prisma.assistantMode.findMany({
        where: {
            OR: [
                {authorId: session.user.id, visibility: 'PRIVATE'},
                {visibility: 'PUBLIC'},
            ],
        },
        orderBy: {id: 'asc'},
    })

    return NextResponse.json<AssistantModeListResponse>({
        assistantModes
    })
}
