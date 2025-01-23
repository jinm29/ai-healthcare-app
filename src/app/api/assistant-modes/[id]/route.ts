import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {AssistantMode} from "@/app/api/assistant-modes/route";

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
    const {id} = await params
    const body: AssistantModePatchRequest = await req.json()

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
