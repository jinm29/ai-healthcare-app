import {OpenAIVisionParser} from "@/lib/health-data/parser/vision/openai";
import {GoogleVisionParser} from "@/lib/health-data/parser/vision/google";

const visions = [
    new OpenAIVisionParser(),
    new GoogleVisionParser(),
]

export default visions
