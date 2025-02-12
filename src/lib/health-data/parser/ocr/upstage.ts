import {BaseOCRParser, OCRParseResult} from "@/lib/health-data/parser/ocr/base-ocr";

export class UpstageOCRParser extends BaseOCRParser {
    async parse(): Promise<OCRParseResult> {
        throw new Error('Not implemented')
    }
}
