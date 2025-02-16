import {NextRequest, NextResponse} from "next/server";
import visions from "@/lib/health-data/parser/vision";
import {VisionParserModel} from "@/lib/health-data/parser/vision/base-vision";

export interface HealthDataParserVisionModelListResponse {
    models: VisionParserModel[];
}

export async function GET(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    const searchParams = req.nextUrl.searchParams
    const parser = visions.find(v => v.name === id)
    if (!parser) return NextResponse.json({error: 'Not found'}, {status: 404})

    let models: VisionParserModel[]
    try {
        models = await parser.models({
            apiUrl: searchParams.get('apiUrl') || undefined,
        });
    } catch (e) {
        console.error(e)
        models = []
    }
    return NextResponse.json({models})
}
