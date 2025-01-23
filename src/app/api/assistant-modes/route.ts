import {NextResponse} from "next/server";
import prisma, {Prisma} from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AssistantMode extends Prisma.AssistantModeGetPayload<{
    select: { id: true, name: true, description: true, systemPrompt: true }
}> {
}

export interface AssistantModeListResponse {
    assistantModes: AssistantMode[]
}

export async function GET() {
    const assistantModes = await prisma.assistantMode.findMany({
        orderBy: {id: 'asc'},
    })
    return NextResponse.json<AssistantModeListResponse>({
        assistantModes
    })
}
