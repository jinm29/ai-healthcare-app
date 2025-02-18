import {handleUpload, type HandleUploadBody} from '@vercel/blob/client';
import {NextResponse} from 'next/server';
import {auth} from "@/auth";

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async () => {
                return {
                    allowedContentTypes: ['image/*', 'application/pdf'],
                    tokenPayload: JSON.stringify({userId: session.user?.id}),
                };
            },
            onUploadCompleted: async () => {
            },
        });
        return NextResponse.json(jsonResponse);
    } catch (error) {
        return NextResponse.json(
            {error: (error as Error).message},
            {status: 400}, // The webhook will retry 5 times waiting for a 200
        );
    }
}
