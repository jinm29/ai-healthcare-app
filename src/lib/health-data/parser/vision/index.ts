import {OpenAIVisionParser} from "@/lib/health-data/parser/vision/openai";
import {GoogleVisionParser} from "@/lib/health-data/parser/vision/google";
import {OllamaVisionParser} from "@/lib/health-data/parser/vision/ollama";

const visions = [
    new OpenAIVisionParser(),
    new GoogleVisionParser(),
    new OllamaVisionParser(),
].filter(v => v.enabled)

export default visions
