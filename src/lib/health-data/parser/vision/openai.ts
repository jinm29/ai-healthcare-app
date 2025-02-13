import {BaseVisionParser, VisionParseOptions, VisionParserModel} from "@/lib/health-data/parser/vision/base-vision";
import {ChatOpenAI} from "@langchain/openai";
import {HealthCheckupSchema} from "@/lib/health-data/parser/schema";
import {ChatPromptTemplate} from "@langchain/core/prompts";

export class OpenAIVisionParser extends BaseVisionParser {

    get name(): string {
        return "OpenAI";
    }

    get apiKeyRequired(): boolean {
        return true
    }

    async models(): Promise<VisionParserModel[]> {
        return [
            {id: 'gpt-4o-mini', name: 'gpt-4o-mini'},
            {id: 'gpt-4o', name: 'gpt-4o'},
            {id: 'o1', name: 'o1'},
            {id: 'o1-mini', name: 'o1-mini'},
        ]
    }

    async parse(options: VisionParseOptions) {
        const llm = new ChatOpenAI({model: options.model.id, apiKey: options.apiKey})
        const messages = options.messages || ChatPromptTemplate.fromMessages([]);
        const chain = messages.pipe(llm.withStructuredOutput(HealthCheckupSchema, {
            method: 'functionCalling',
        }))
        return await chain.withRetry({stopAfterAttempt: 3}).invoke(options.input);
    }
}
