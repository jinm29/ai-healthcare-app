export interface OCRParseResult {
    markdown: string;
}

export abstract class BaseOCRParser {
    abstract parse(): Promise<OCRParseResult>
}
