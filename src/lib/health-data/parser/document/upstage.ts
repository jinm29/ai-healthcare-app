import {
    BaseDocumentParser,
    DocumentModelOptions,
    DocumentOCROptions,
    DocumentParseOptions,
    DocumentParseResult,
    DocumentParserModel,
    OCRParseResult
} from "@/lib/health-data/parser/document/base-document";
import FormData from "form-data";
import fs from "node:fs";
import fetch from "node-fetch";
import {currentDeploymentEnv} from "@/lib/current-deployment-env";

export class UpstageDocumentParser extends BaseDocumentParser {

    get name(): string {
        return 'Upstage'
    }

    get apiKeyRequired(): boolean {
        return currentDeploymentEnv === 'local'
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async models(options?: DocumentModelOptions): Promise<DocumentParserModel[]> {
        return [
            {id: 'document-parse', name: 'Document Parse'}
        ]
    }

    async ocr(options: DocumentOCROptions): Promise<OCRParseResult> {
        const formData = new FormData();
        formData.append('document', fs.createReadStream(options.input));
        formData.append("schema", "oac");
        formData.append("model", "ocr-2.2.1");

        const apiKey = currentDeploymentEnv === 'cloud' ? process.env.UPSTAGE_API_KEY : options.apiKey
        const response = await fetch('https://api.upstage.ai/v1/document-ai/ocr', {
            method: 'POST',
            body: formData,
            headers: {Authorization: `Bearer ${apiKey}`}
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

        const apiKey = currentDeploymentEnv === 'cloud' ? process.env.UPSTAGE_API_KEY : options.apiKey
        const response = await fetch('https://api.upstage.ai/v1/document-ai/document-parse', {
            method: 'POST',
            body: formData,
            headers: {Authorization: `Bearer ${apiKey}`}
        })

        return {document: await response.json()}
    }
}
