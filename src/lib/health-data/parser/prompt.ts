import {BaseMessagePromptTemplateLike} from "@langchain/core/prompts";

export interface MessagePayload {
    context?: string;
    image_data?: string;
}

const prompts: {
    [key: string]: BaseMessagePromptTemplateLike[]
} = {
    both: [
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
    ],
    onlyText: [
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
    ],
    onlyImage: [
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
    ]
}

/**
 * Get the appropriate prompt based on the input type
 *
 * @param excludeImage
 * @param excludeText
 */
export function getParsePrompt({excludeImage, excludeText}: {
    excludeImage: boolean,
    excludeText: boolean
}): BaseMessagePromptTemplateLike[] {
    if (!excludeImage && !excludeText) {
        return prompts.both
    } else if (excludeImage && !excludeText) {
        return prompts.onlyText
    } else if (!excludeImage && excludeText) {
        return prompts.onlyImage
    } else {
        throw new Error('Invalid prompt type')
    }
}
