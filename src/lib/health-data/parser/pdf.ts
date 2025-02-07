/* eslint-disable */
import * as crypto from "node:crypto";
import * as fsPromise from "node:fs/promises";
import fs from 'node:fs';
import {fromBuffer as pdf2picFromBuffer} from 'pdf2pic'
import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {HealthCheckupSchema} from "@/lib/health-data/parser/schema";
import FormData from "form-data";
import fetch from "node-fetch";
import {fileTypeFromBuffer} from 'file-type';

/**
 * Get the MD5 hash of a file
 *
 * @param buffer
 */
async function getFileMd5(buffer: Buffer) {
    const hash = crypto.createHash('md5')
    hash.update(buffer)
    return hash.digest('hex')
}

async function documentOCR({document}: { document: string }) {
    const documentFile = await fsPromise.readFile(document)
    const filename = await getFileMd5(documentFile)
    const path = `./public/uploads/${filename}_ocr.json`

    // if file exists, return the result
    const fileExists = await fsPromise.access(path).then(() => true).catch(() => false)
    if (fileExists) return JSON.parse(await fsPromise.readFile(path, 'utf-8'))

    const formData = new FormData();
    formData.append('document', fs.createReadStream(document));
    formData.append("schema", "oac");
    formData.append("model", "ocr-2.2.1");

    const response = await fetch('https://api.upstage.ai/v1/document-ai/ocr', {
        method: 'POST',
        body: formData,
        headers: {Authorization: `Bearer ${process.env.UPSTAGE_API_KEY}`}
    });

    const result = await response.json()

    // Save the result
    await fsPromise.writeFile(path, JSON.stringify(result))

    return result
}

async function documentParse({document}: { document: string }) {
    const documentFile = await fsPromise.readFile(document)
    const filename = await getFileMd5(documentFile)
    const path = `./public/uploads/${filename}.json`

    // if file exists, return the result
    const fileExists = await fsPromise.access(path).then(() => true).catch(() => false)
    if (fileExists) return JSON.parse(await fsPromise.readFile(path, 'utf-8'))

    const formData = new FormData();
    formData.append('document', fs.createReadStream(document));
    formData.append('ocr', 'force')
    formData.append('output_formats', JSON.stringify(["markdown"]))
    formData.append("coordinates", "true");
    formData.append("model", "document-parse");

    const response = await fetch('https://api.upstage.ai/v1/document-ai/document-parse', {
        method: 'POST',
        body: formData,
        headers: {Authorization: `Bearer ${process.env.UPSTAGE_API_KEY}`}
    })

    const result = await response.json()

    // Save the result
    await fsPromise.writeFile(path, JSON.stringify(result))

    return result
}

async function processHealthCheckupOCRWithGPTVisionMergeReport({imagePaths, excludeImage, excludeText}: {
    imagePaths: string[],
    excludeImage: boolean,
    excludeText: boolean,
}) {

    // Extract text data if not excluding text
    let pages: { page_content: string }[] | undefined = [];
    if (!excludeText) {
        pages = []
        for (const path of imagePaths) {
            const {content} = await documentParse({document: path})
            const {markdown} = content
            pages.push({page_content: markdown})
        }
    } else {
        pages = undefined
    }

    // Extract image data if not excluding images
    const imageDataList: string[] = []
    if (!excludeImage) {
        for (const path of imagePaths) {
            const image = await fsPromise.readFile(path)
            imageDataList.push(`data:image/png;base64,${image.toString('base64')}`)
        }
    }

    // Messages
    let messages: ChatPromptTemplate;
    if (!excludeImage && !excludeText) {
        // Both image and text
        messages = ChatPromptTemplate.fromMessages([
            [
                "human",
                `You are a precise health data analyst, focused on accurately extracting and organizing test results from both parsed text and image inputs.
Follow instructions step-by-step to ensure that results are as accurate as possible.
Step 1: Extract Results from Both Image and Parsed Text
1. Extract all test names and results from both the image and parsed text into two separate tables.
2. Use the following rules to handle any inconsistencies between the two data sources:

Step 2: Cross-Check and Validate Results from Both Sources
1. If the parsed text contains errors or irregular formatting (e.g., backslashes, multiple dots, broken numbers, misplaced dots or numbers, or non-sensical values), ignore the parsed text and use the results extracted from the image.
2. If the image extraction contains unclear or incomplete data (e.g., missing test names or garbled characters), prioritize the parsed text if it is correct.
3. If both the image and parsed text are reliable, cross-check the results to ensure they match. If there are discrepancies, prioritize the most accurate result based on clarity and completeness.

Step 3: Multi-Component Tests
1. For multi-component tests (e.g., blood pressure '118/65'), separate values (e.g., systolic: 118, diastolic: 65).
2. Ensure the results are correctly labeled for left/right (좌/우) or other components when applicable.

Step 4: Finalizing Results
1. Create a final table with the most accurate results, combining data from both the image and text inputs, based on the cross-validation above.
2. Double-check that no results are missing and that each test value is correctly mapped to its corresponding test name.
3. Store all test results in the 'test_results' field. Do not miss a single result. If no results, set 'test_results' to {{}}.
4. Do not list the same test name more than once in the arguments. Avoid duplicates and repeats even if there are multiple values.

Additional Instructions:
- Ensure that results include only the valid test names from the report.
- Date Format: yyyy-mm-dd.`
            ],
            ["human", 'This is the parsed text:\n{context}'],
            ["human", [{type: "image_url", image_url: {url: '{image_data}'}}]],
        ]);
    } else if (excludeImage && !excludeText) {
        // Only text
        messages = ChatPromptTemplate.fromMessages([
            [
                "human",
                `As a precise health data analyst focus on accurately extracting test results from the parsed text of the health report.
Follow these guidelines to extract all actual test results:
1. Extract only the actual test results. Reference ranges, page numbers, or any other numbers that are not test results should never be extracted as test results.
2. For multi-component tests (e.g., blood pressure '118/65'), separate values (e.g., systolic: 118, diastolic: 65).
3. Ensure the results are correctly labeled for left/right (좌/우) or other components when applicable.
4. Double check to make sure that no results are missing and that each test value is correctly mapped to its corresponding test name.
5. Store all test results in the 'test_results' field. Do not miss a single result. If no results, set 'test_results' to {{}}.
6. Do not list the same test name more than once in the arguments. Avoid duplicates and repeats even if there are multiple values.`
            ],
            ["human", 'This is the parsed text:\n{context}']
        ])
    } else if (!excludeImage && excludeText) {
        // Only image
        messages = ChatPromptTemplate.fromMessages([
            ['human', `As a precise health data analyst focus on accurately extracting test results from the image of the health report.
Follow these guidelines to extract all actual test results:
1. Extract only the actual test results. Reference ranges, page numbers, or any other numbers that are not test results should never be extracted as test results.
- Pay attention to headers or labels that indicate whether a section contains test results or reference values.
- Values listed under sections labeled as '참고기준치' or similar should be considered reference ranges, not actual test results.
- Ensure that any value extracted as a test result is not part of a reference range.
2. For multi-component tests (e.g., blood pressure '118/65'), separate values (e.g., systolic: 118, diastolic: 65).
3. Ensure the results are correctly labeled for left/right (좌/우) or other components when applicable.
4. Double check to make sure that no results are missing and that each test value is correctly mapped to its corresponding test name.
5. Store all test results in the 'test_results' field. Do not miss a single result. If no results, set 'test_results' to {{}}.
6. Do not list the same test name more than once in the arguments. Avoid duplicates and repeats even if there are multiple values.`],
            ['human', [{type: "image_url", image_url: {url: '{image_data}'}}]],
        ])
    } else {
        throw new Error('Both image and text cannot be excluded')
    }

    const llm = new ChatOpenAI({model: 'gpt-4o'})
    const chain = messages.pipe(llm.withStructuredOutput(HealthCheckupSchema, {
        method: 'functionCalling',
    }))

    const numPages = pages ? pages.length : imageDataList.length
    const batchInputs: { context?: string, image_data?: string }[] = []
    for (let i = 0; i < numPages; i++) {
        const inputData: { context?: string, image_data?: string } = {}
        if (!excludeText && pages) {
            inputData.context = pages[i].page_content
        }
        if (!excludeImage && imageDataList) {
            inputData.image_data = imageDataList[i]
        }
        batchInputs.push(inputData)
    }

    // Process the batch inputs
    const batchData = await chain.withRetry(
        {
            stopAfterAttempt: 3,
        }
    ).batch(batchInputs, {})
    const data: { [key: string]: any } = {}
    for (let i = 0; i < batchData.length; i++) {
        data[`page_${i}`] = batchData[i]
    }

    // Merge Results
    const mergeInfo: { [key: string]: { pages: number[], values: any[] } } = {}

    for (const key of HealthCheckupSchema.shape.test_result.keyof().options) {
        const testFields = [];
        const testPages: number[] = [];
        for (let i = 0; i < numPages; i++) {
            const healthCheckup = data[`page_${i}`]
            const healthCheckupTestResult = healthCheckup.test_result

            if (healthCheckupTestResult.hasOwnProperty(key) && healthCheckupTestResult[key]) {
                testFields.push(healthCheckupTestResult[key])
                testPages.push(i)
            }
        }

        if (testFields.length > 0) {
            mergeInfo[key] = {'pages': testPages, 'values': testFields}
        }
    }

    const mergedTestResult: { [key: string]: any } = {}
    const mergedTestResultPage: { [key: string]: { page: number } } = {}

    // Merge the results
    for (const mergeInfoKey in mergeInfo) {
        const mergeTarget = mergeInfo[mergeInfoKey]
        mergedTestResult[mergeInfoKey] = mergeTarget.values[0]
        mergedTestResultPage[mergeInfoKey] = {
            page: mergeTarget.pages[0] + 1
        }
    }

    let mergeData: any = {}

    // Merge name and date
    for (let i = 0; i < numPages; i++) {
        const healthCheckup = data[`page_${i}`]
        mergeData = {
            ...mergeData,
            ...healthCheckup,
        }
    }

    // Update test_result with merged data
    mergeData['test_result'] = mergedTestResult

    // Create final HealthCheckup object
    const finalHealthCheckup = HealthCheckupSchema.parse(mergeData)

    return {
        finalHealthCheckup: finalHealthCheckup,
        mergedTestResultPage: mergedTestResultPage,
    }
}

async function processBatchWithConcurrency<T, R>(
    items: T[],
    processItem: (item: T) => Promise<R>,
    concurrencyLimit: number
): Promise<R[]> {
    const results: R[] = [];

    // Process items in batches
    for (let i = 0; i < items.length; i += concurrencyLimit) {
        const batch = items.slice(i, i + concurrencyLimit);
        const batchResults = await Promise.all(
            batch.map(item => processItem(item))
        );
        results.push(...batchResults);
    }

    return results;
}

async function healthCheckupOCRWithGPTVisionMergeReport(
    {file: filePath}: { file: string }
) {
    const file = await fsPromise.readFile(filePath)
    const fileBuffer = Buffer.from(file)
    const result = await fileTypeFromBuffer(fileBuffer)
    if (!result) throw new Error('Invalid file type')
    const mime = result.mime
    const fileHash = await getFileMd5(Buffer.from(file))

    const images: string[] = []
    if (mime === 'application/pdf') {
        const pdf2picConverter = pdf2picFromBuffer(fileBuffer, {
            preserveAspectRatio: true,
        })
        for (const image of await pdf2picConverter.bulk(-1, {responseType: 'base64'})) {
            if (image.base64) images.push(`data:image/png;base64,${image.base64}`)
        }
    } else {
        images.push(`data:${mime};base64,${fileBuffer.toString('base64')}`)
    }

    // Write the image data to a file
    const imagePaths = []
    for (let i = 0; i < images.length; i++) {
        const path = `./public/uploads/${fileHash}_${i}.png`
        await fsPromise.writeFile(path, Buffer.from(images[i].split(',')[1], 'base64'))
        imagePaths.push(path)
    }

    // prepare ocr results
    const ocrResults = await documentOCR({document: filePath})

    // prepare parse results
    await processBatchWithConcurrency(
        imagePaths,
        async (path) => documentParse({document: path}),
        3
    )

    const [
        {finalHealthCheckup: resultTotal, mergedTestResultPage: resultTotalPages},
        {finalHealthCheckup: resultText, mergedTestResultPage: resultTextPages},
        {finalHealthCheckup: resultImage, mergedTestResultPage: resultImagePages}
    ] = await Promise.all([
        processHealthCheckupOCRWithGPTVisionMergeReport({imagePaths, excludeImage: false, excludeText: false}),
        processHealthCheckupOCRWithGPTVisionMergeReport({imagePaths, excludeImage: false, excludeText: true}),
        processHealthCheckupOCRWithGPTVisionMergeReport({imagePaths, excludeImage: true, excludeText: false}),
    ]);

    const resultDictTotal = resultTotal.test_result
    const resultDictText = resultText.test_result
    const resultDictImage = resultImage.test_result

    const mergedTestResult: { [key: string]: any } = {}
    const mergedPageResult: { [key: string]: { page: number } | null } = {}

    for (const key of HealthCheckupSchema.shape.test_result.keyof().options) {
        const valueTotal =
            resultDictTotal.hasOwnProperty(key) &&
            resultDictTotal[key] !== null &&
            resultDictTotal[key]!.value !== null
                ? resultDictTotal[key]
                : null;
        const pageTotal = valueTotal !== null ? resultTotalPages[key] : null;

        const valueText =
            resultDictText.hasOwnProperty(key) &&
            resultDictText[key] !== null &&
            resultDictText[key]!.value !== null
                ? resultDictText[key]
                : null;
        const pageText = valueText !== null ? resultTextPages[key] : null;

        const valueImage =
            resultDictImage.hasOwnProperty(key) &&
            resultDictImage[key] !== null &&
            resultDictImage[key]!.value !== null
                ? resultDictImage[key]
                : null;
        const pageImage = valueImage !== null ? resultImagePages[key] : null;

        if (valueTotal === null) {
            if (valueText !== null) {
                mergedTestResult[key] = valueText;
                mergedPageResult[key] = pageText;
            } else if (valueImage !== null) {
                mergedTestResult[key] = valueImage;
                mergedPageResult[key] = pageImage;
            } else {
                mergedTestResult[key] = valueText;
                mergedPageResult[key] = pageText;
            }
        } else {
            mergedTestResult[key] = valueTotal;
            mergedPageResult[key] = pageTotal;
        }
    }

    // remove all null values in mergedTestResult
    for (const key in mergedTestResult) {
        if (mergedTestResult[key] === null) {
            delete mergedTestResult[key]
        }
    }

    const healthCheckup = HealthCheckupSchema.parse({
        ...resultTotal,
        test_result: mergedTestResult
    })

    return {
        data: healthCheckup,
        page: mergedPageResult,
        ocrResult: ocrResults,
    }
}

export async function parseHealthDataFromPDF(
    {file}: { file: string },
) {

    const {
        data, page, ocrResult
    } = await healthCheckupOCRWithGPTVisionMergeReport({file})

    return {
        data: [data],
        pages: [page],
        ocrResults: [ocrResult],
    }
}
