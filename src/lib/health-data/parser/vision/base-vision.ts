import {ChatPromptTemplate} from "@langchain/core/prompts";
import {HealthCheckupType} from "@/lib/health-data/parser/schema";

export interface VisionParseOptions {
    input: { [key: string]: unknown };
    model: VisionParserModel;
    messages?: ChatPromptTemplate[];
}

export interface VisionParserModel {
    id: string;
    name: string;
}

export abstract class BaseVisionParser {
    abstract models(): Promise<VisionParserModel[]>

    abstract parse(options: VisionParseOptions): Promise<HealthCheckupType>
}
