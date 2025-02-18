import {ChatPromptTemplate} from "@langchain/core/prompts";
import {HealthCheckupType} from "@/lib/health-data/parser/schema";
import {MessagePayload} from "@/lib/health-data/parser/prompt";

export interface VisionModelOptions {
    apiUrl?: string;
}

export interface VisionParseOptions {
    input: MessagePayload;
    model: VisionParserModel;
    messages?: ChatPromptTemplate;
    apiUrl?: string;
    apiKey?: string;
}

export interface VisionParserModel {
    id: string;
    name: string;
}

export abstract class BaseVisionParser {
    abstract get name(): string;

    abstract get apiKeyRequired(): boolean;

    abstract get enabled(): boolean;

    get apiUrl(): string | undefined {
        return undefined;
    }

    get apiUrlRequired(): boolean {
        return false;
    }

    abstract models(options?: VisionModelOptions): Promise<VisionParserModel[]>

    abstract parse(options: VisionParseOptions): Promise<HealthCheckupType>
}
