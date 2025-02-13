import {NextRequest, NextResponse} from "next/server";
import {DocumentParserModel} from "@/lib/health-data/parser/document/base-document";
import documents from "@/lib/health-data/parser/document";

export interface HealthDataParserDocumentModelListResponse {
    models: DocumentParserModel[];
}

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    const searchParams = req.nextUrl.searchParams
    const parser = documents.find(v => v.name === id)
    if (!parser) return NextResponse.json({error: 'Not found'}, {status: 404})

    const models = await parser.models({
        apiUrl: searchParams.get('apiUrl') || undefined,
    });
    return NextResponse.json({models})
}
