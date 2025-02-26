import {NextRequest, NextResponse} from "next/server";
import prisma, {Prisma} from "@/lib/prisma";
import {auth} from "@/auth";

export interface AssistantMode extends Prisma.AssistantModeGetPayload<{
    select: { id: true, name: true, description: true, systemPrompt: true }
}> {
    id: string
}

export interface AssistantModeListResponse {
    assistantModes: AssistantMode[]
}

export interface AssistantModeCreateRequest {
    name: string;
    description: string;
    systemPrompt: string;
    context: string;
}

export interface AssistantModeCreateResponse extends AssistantMode {
    id: string;
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

export async function POST(req: NextRequest) {
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }

    const data: AssistantModeCreateRequest = await req.json()

    const assistantMode = await prisma.assistantMode.create({
        data: {
            name: data.name,
            description: data.description,
            systemPrompt: data.systemPrompt,
            authorId: session.user.id,
            visibility: 'PRIVATE',
            contexts: {
                create: {
                    data: data.context,
                }
            }
        }
    })

    return NextResponse.json<AssistantModeCreateResponse>(assistantMode)
}