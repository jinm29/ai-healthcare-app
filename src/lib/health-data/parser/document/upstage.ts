import {
    BaseDocumentParser,
    DocumentOCROptions,
    DocumentParseOptions,
    DocumentParseResult,
    DocumentParserModel,
    OCRParseResult
} from "@/lib/health-data/parser/document/base-document";
import FormData from "form-data";
import fs from "node:fs";
import fetch from "node-fetch";

export class UpstageDocumentParser extends BaseDocumentParser {

    get name(): string {
        return 'Upstage'
    }

    get apiKeyRequired(): boolean {
        return true
    }

    async models(): Promise<DocumentParserModel[]> {
        return [
            {id: 'document-parse', name: 'Document Parse'}
        ]
    }

    async ocr(options: DocumentOCROptions): Promise<OCRParseResult> {
        const formData = new FormData();
        formData.append('document', fs.createReadStream(options.input));
        formData.append("schema", "oac");
        formData.append("model", "ocr-2.2.1");

        const response = await fetch('https://api.upstage.ai/v1/document-ai/ocr', {
            method: 'POST',
            body: formData,
            headers: {Authorization: `Bearer ${options.apiKey}`}
        });

        return {ocr: await response.json()}
    }

    async parse(options: DocumentParseOptions): Promise<DocumentParseResult> {
        const formData = new FormData();
        formData.append('document', fs.createReadStream(options.input));
        formData.append('ocr', 'force')
        formData.append('output_formats', JSON.stringify(["markdown"]))
        formData.append("coordinates", "true");
        formData.append("model", "document-parse");

        const response = await fetch('https://api.upstage.ai/v1/document-ai/document-parse', {
            method: 'POST',
            body: formData,
            headers: {Authorization: `Bearer ${options.apiKey}`}
        })

        return {document: await response.json()}
    }
}
