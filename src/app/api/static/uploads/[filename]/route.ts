import {NextRequest, NextResponse} from "next/server";
import fs from "fs/promises";
import {auth} from "@/auth";

export async function GET(
    _req: NextRequest,
    {params}: { params: Promise<{ filename: string }> }
) {
    // Uploaded health documents are user medical data. Every other data route
    // requires a session; serving these pages to anyone holding the filename
    // was the one exception. Same-origin <img> requests carry cookies, so the
    // app's own rendering of parse results is unaffected.
    const session = await auth()
    if (!session || !session.user) return NextResponse.json({error: 'Unauthorized'}, {status: 401})

    const {filename} = await params

    if (!filename.match(/^[a-zA-Z0-9-_]+\.(pdf|png)$/)) {
        return new Response('Invalid filename', {status: 400})
    }

    const filePath = `./public/uploads/${filename}`
    let file: Buffer
    try {
        file = await fs.readFile(filePath)
    } catch {
        return new Response('Not found', {status: 404})
    }

    // Response blob
    return new Response(new Uint8Array(file), {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=${filename}`
        }
    })
}
