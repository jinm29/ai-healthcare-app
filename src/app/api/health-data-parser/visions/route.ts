import vision from "@/lib/health-data/parser/vision";
import {NextResponse} from "next/server";

export interface HealthDataParserVision {
    name: string;
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
            apiUrl: v.apiUrl,
            apiKeyRequired: v.apiKeyRequired,
            apiUrlRequired: v.apiUrlRequired
        })
    }

    return NextResponse.json({visions: data})
}
