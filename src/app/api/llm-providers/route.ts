import prisma, {Prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";
import {auth} from "@/auth";
import {decrypt} from "@/lib/encryption";

export interface LLMProvider extends Prisma.LLMProviderGetPayload<{
    select: {
        id: true,
        providerId: true,
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
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const llmProviders = await prisma.lLMProvider.findMany({
        where: {authorId: session.user.id},
        orderBy: {order: 'asc'}
    })
    return NextResponse.json<LLMProviderListResponse>({
        llmProviders: llmProviders.map((provider) => {
            let decryptedApiKey: string
            try {
                decryptedApiKey = decrypt(provider.apiKey)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                decryptedApiKey = ''
            }

            return {...provider, apiKey: decryptedApiKey}
        })
    })
}
