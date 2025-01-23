import {NextResponse} from "next/server";
import prisma, {Prisma} from "@/lib/prisma";

export interface AssistantModeListResponse {
    assistantModes: Prisma.AssistantModeGetPayload<{
        select: { id: true, name: true, description: true, systemPrompt: true }
    }>[]
}

export async function GET() {
    const assistantModes = await prisma.assistantMode.findMany({})
    return NextResponse.json<AssistantModeListResponse>({
        assistantModes
    })
}
