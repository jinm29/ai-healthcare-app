import {VisionParserModel} from "@/lib/health-data/parser/vision/base-vision";
import vision from "@/lib/health-data/parser/vision";
import {NextResponse} from "next/server";

export interface HealthDataParserVision {
    name: string;
    models: VisionParserModel[];
    apiUrl?: string;
    apiKeyRequired: boolean;
    apiUrlRequired: boolean;
}

export interface HealthDataParserVisionListResponse {
    visions: HealthDataParserVision[];
}

export async function GET() {
    const data: HealthDataParserVision[] = []

    for (const v of vision) {
        data.push({
            name: v.name,
            models: await v.models(),
            apiUrl: v.apiUrl,
            apiKeyRequired: v.apiKeyRequired,
            apiUrlRequired: v.apiUrlRequired
        })
    }

    return NextResponse.json({visions: data})
}
