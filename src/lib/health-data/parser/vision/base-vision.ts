import {ChatPromptTemplate} from "@langchain/core/prompts";
import {HealthCheckupType} from "@/lib/health-data/parser/schema";
import {MessagePayload} from "@/lib/health-data/parser/prompt";

export interface VisionParseOptions {
    input: MessagePayload;
    model: VisionParserModel;
    messages?: ChatPromptTemplate;
    apiKey?: string;
}

export interface VisionParserModel {
    id: string;
    name: string;
}

export abstract class BaseVisionParser {
    abstract get name(): string;

    abstract models(): Promise<VisionParserModel[]>

    abstract parse(options: VisionParseOptions): Promise<HealthCheckupType>
}
