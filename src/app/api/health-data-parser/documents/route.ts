import {NextResponse} from "next/server";
import documents from "@/lib/health-data/parser/document";
import {DocumentParserModel} from "@/lib/health-data/parser/document/base-document";

export interface HealthDataParserDocument {
    name: string;
    apiKeyRequired: boolean;
    models: DocumentParserModel[];
}

export interface HealthDataParserDocumentListResponse {
    documents: HealthDataParserDocument[];
}

export async function GET() {
    const data: HealthDataParserDocument[] = []

    for (const v of documents) {
        data.push({name: v.name, apiKeyRequired: v.apiKeyRequired, models: await v.models()})
    }

    return NextResponse.json({documents: data})
}
