import {BaseVisionParser, VisionParseOptions, VisionParserModel} from "@/lib/health-data/parser/vision/base-vision";
import {ChatGoogleGenerativeAI} from "@langchain/google-genai";
import {HealthCheckupSchema} from "@/lib/health-data/parser/schema";
import {ChatPromptTemplate} from "@langchain/core/prompts";

class GoogleVisionParser extends BaseVisionParser {

    async models(): Promise<VisionParserModel[]> {
        return [
            {id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash'},
            {id: 'gemini-2.0-flash-lite-preview-02-05', name: 'Gemini 2.0 Flash-Lite'},
            {id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash'},
            {id: 'gemini-1.5-flash-8b', name: 'Gemini 1.5 Flash-8B'},
            {id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro'},
        ]
    }

    async parse(options: VisionParseOptions) {
        const llm = new ChatGoogleGenerativeAI({model: options.model.id})
        const messages = ChatPromptTemplate.fromMessages(options.messages || []);
        const chain = messages.pipe(llm.withStructuredOutput(HealthCheckupSchema, {
            method: 'functionCalling',
        }))
        return await chain.withRetry({stopAfterAttempt: 3}).invoke(options.input);
    }
}
