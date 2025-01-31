import prisma, {Prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export interface LLMProvider extends Prisma.LLMProviderGetPayload<{
    select: {
        id: true,
        name: true,
        apiKey: true,
        apiURL: true,
    }
}> {
    id: string
}

export interface LLMProviderListResponse {
    llmProviders: LLMProvider[]
}

export async function GET() {
    const llmProviders = await prisma.lLMProvider.findMany({
        orderBy: {
            order: 'asc'
        }
    })
    return NextResponse.json<LLMProviderListResponse>({
        llmProviders
    })
}
