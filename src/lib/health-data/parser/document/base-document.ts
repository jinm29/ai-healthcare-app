export interface OCRParseResult {
    ocr: unknown
}

export interface DocumentParseResult {
    document: unknown
}

export interface DocumentOCROptions {
    input: string; // File path
    model: DocumentParserModel;
    apiKey?: string;
}

export interface DocumentParseOptions {
    input: string; // File path
    model: DocumentParserModel;
    apiKey?: string;
}

export interface DocumentParserModel {
    id: string;
    name: string;
}

export abstract class BaseDocumentParser {
    abstract get name(): string;

    abstract get apiKeyRequired(): boolean;

    abstract models(): Promise<DocumentParserModel[]>

    abstract ocr(options: DocumentOCROptions): Promise<OCRParseResult>

    abstract parse(options: DocumentParseOptions): Promise<DocumentParseResult>
}
