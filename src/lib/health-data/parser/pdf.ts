/* eslint-disable @typescript-eslint/no-explicit-any */
import OpenAI from "openai";
import {fromBuffer as pdf2picFromBuffer} from 'pdf2pic'
import {zodResponseFormat} from "openai/helpers/zod";
import {HealthCheckupSchema} from "@/lib/health-data/parser/schema";
import {z} from "zod";

/**
 * 특정 객체의 shape을 받아, 주어진 chunkSize(예:100) 단위로
 * 나누어 여러 개의 shape(부분 객체)로 쪼갭니다.
 */
function chunkObject<T extends Record<string, any>>(obj: T, chunkSize: number): T[] {
    const keys = Object.keys(obj);
    const chunks: T[] = [];

    for (let i = 0; i < keys.length; i += chunkSize) {
        const slice = keys.slice(i, i + chunkSize);
        const chunkShape: any = {};
        for (const key of slice) {
            chunkShape[key] = obj[key];
        }
        chunks.push(chunkShape);
    }

    return chunks;
}

export async function parseHealthDataFromPDF(
    {file}: { file: File | string },
) {
    const parsingLogs: string[] = [];
    let ocrResult: unknown = undefined;
    parsingLogs.push(`File type: ${file instanceof File ? file.type : 'unknown'}`);

    parsingLogs.push(`OCR processing...`);
    try {
        const formData = new FormData();
        formData.append('document', file);
        const response = await fetch(`https://api.upstage.ai/v1/document-ai/ocr`, {
            headers: {Authorization: `Bearer ${process.env.UPSTAGE_API_KEY}`},
            body: formData,
            method: 'POST'
        })
        ocrResult = await response.json()
    } catch (e) {
        // OCR processing failed
        parsingLogs.push(`OCR processing failed: ${e}`);
    }

    // Extract images from the file
    parsingLogs.push('Extracting images from file...');
    const encodedImages = (await Promise.all([file].map(async (file) => {
        if (file instanceof File) {
            if (file.type.startsWith('image')) {
                parsingLogs.push('Processing image file...');
                const arrayBuffer = await file.arrayBuffer()
                parsingLogs.push('Image converted to base64');
                return [{
                    type: 'image_url',
                    image_url: {url: `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`}
                }]
            } else if (file.type.startsWith('application/pdf')) {
                parsingLogs.push('Processing PDF file...');
                const messages = []
                const pdf2picConverter = pdf2picFromBuffer(
                    Buffer.from(await file.arrayBuffer()),
                )
                const images = await pdf2picConverter.bulk(-1, {responseType: 'base64'})
                parsingLogs.push(`Converted ${images.length} PDF pages to images`);
                for (const image of images) {
                    if (image.base64) messages.push({
                        type: 'image_url',
                        image_url: {url: `data:image/png;base64,${image.base64}`}
                    })
                }
                return messages
            }
        }
        return undefined
    }))).flat().filter((message) => message !== undefined)

    parsingLogs.push('Sending to GPT for analysis...');

    // Split the test_result object into chunks of 100 keys each
    const fullShape = HealthCheckupSchema.shape;
    const testResultShape = (fullShape.test_result).shape;
    const chunkedTestResultShapes = chunkObject(testResultShape, 30);
    const partialSchemas = chunkedTestResultShapes.map((chunk) => {
        return z.object({
            date: fullShape.date,
            name: fullShape.name,
            test_result: z.object(chunk).describe("Partial test_result chunk"),
        });
    });
    parsingLogs.push("Sending parallel requests to GPT (chunked schemas)...");

    const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

    // Merged Result per page
    const mergedResults = []

    for (let i = 0; i < encodedImages.length; i++) {
        const encodedImage = encodedImages[i]
        const messages = [
            {
                role: 'user',
                content: [
                    {type: 'text', text: 'Extract all data.\nresponse format: json'},
                    encodedImage
                ]
            },
        ];

        const batchSize = 5;
        const partialResults = [];

        for (let i = 0; i < partialSchemas.length; i += batchSize) {
            const batch = partialSchemas.slice(i, i + batchSize);

            const batchResults = await Promise.all(
                batch.map(async (partialSchema, index) => {
                    const actualIndex = i + index;
                    parsingLogs.push(`Requesting partial schema #${actualIndex + 1} ...`);

                    const chatCompletion = await openai.beta.chat.completions.parse({
                        model: "gpt-4o",
                        messages: messages as any,
                        max_tokens: 4096,
                        response_format: zodResponseFormat(partialSchema, `partial_schema_${actualIndex + 1}`),
                    });

                    const parsed = chatCompletion.choices[0].message.parsed;
                    parsingLogs.push(`Received partial result #${actualIndex + 1}`);
                    return parsed;
                })
            );

            partialResults.push(...batchResults);
        }

        parsingLogs.push("Merging partial results...");

        const mergedResult: z.infer<typeof HealthCheckupSchema> = {
            date: undefined,
            name: undefined,
            test_result: {},
        };
        const mergedTestResult = mergedResult.test_result as Record<string, any>;

        for (const partial of partialResults) {
            if (partial === null) continue;

            if (partial.date) mergedResult.date = partial.date;
            if (partial.name) mergedResult.name = partial.name;

            const partialTestResult = partial.test_result as Record<string, any>;
            for (const key of Object.keys(partialTestResult)) {
                if (partialTestResult[key].value) mergedTestResult[key] = partialTestResult[key];
            }
        }
        mergedResults.push(mergedResult)
    }

    const mergedResult: z.infer<typeof HealthCheckupSchema> = {
        date: undefined,
        name: undefined,
        test_result: {},
    };
    const mergedResultTestResult = mergedResult.test_result as any
    for (const mergeResult of mergedResults) {
        if (mergeResult.date) mergedResult.date = mergeResult.date;
        if (mergeResult.name) mergedResult.name = mergeResult.name;

        const partialTestResult = mergeResult.test_result as Record<string, any>;
        for (const key of Object.keys(partialTestResult)) {
            if (partialTestResult[key].value) mergedResultTestResult[key] = partialTestResult[key];
        }
    }

    return {
        parsed: mergedResult,
        ocr: ocrResult,
        dataPerPage: mergedResults,
        parsingLogs
    }
}
