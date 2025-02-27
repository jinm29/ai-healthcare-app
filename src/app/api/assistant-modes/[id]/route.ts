import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {AssistantMode} from "@/app/api/assistant-modes/route";
import {auth} from "@/auth";

export interface AssistantModePatchRequest {
    systemPrompt?: string
}

export interface AssistantModePatchResponse {
    assistantMode: AssistantMode
}

export async function PATCH(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const {id} = await params
    const body: AssistantModePatchRequest = await req.json()

    // Check if the user is the author of the assistant mode
    const checkAuthor = await prisma.assistantMode.findUnique({select: {authorId: true}, where: {id}})
    if (checkAuthor?.authorId !== session.user.id) {
        return NextResponse.json({message: "Forbidden"}, {status: 403});
    }


    const assistantMode = await prisma.assistantMode.update({
        where: {id},
        data: body,
        select: {
            id: true,
            name: true,
            description: true,
            systemPrompt: true
        }
    });

    return NextResponse.json<AssistantModePatchResponse>({assistantMode})
}
