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
    apiUrl?: string;
}

export interface DocumentParseOptions {
    input: string; // File path
    model: DocumentParserModel;
    apiKey?: string;
    apiUrl?: string;
}

export interface DocumentParserModel {
    id: string;
    name: string;
}

export interface DocumentModelOptions {
    apiUrl?: string;
}

export abstract class BaseDocumentParser {
    abstract get name(): string;

    abstract get apiKeyRequired(): boolean;

    abstract get enabled(): boolean;

    abstract models(options?: DocumentModelOptions): Promise<DocumentParserModel[]>

    abstract ocr(options: DocumentOCROptions): Promise<OCRParseResult>

    abstract parse(options: DocumentParseOptions): Promise<DocumentParseResult>
}
