import {BaseOCRParser, OCRParseResult} from "@/lib/health-data/parser/ocr/base-ocr";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class DoclingOCRParser extends BaseOCRParser {
    async parse(): Promise<OCRParseResult> {
        throw new Error('Not implemented')
    }
}
