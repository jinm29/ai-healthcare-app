import {task} from '@trigger.dev/sdk/v3'
import {fromBuffer as pdf2picFromBuffer} from 'pdf2pic'
import fetch from 'node-fetch'

interface PdfToImagesPayload {
    pdfUrl: string;
}

interface PdfToImagesResult {
    images: string[];
}

export const pdfToImages = task({
    id: 'pdf-to-image',
    async run({pdfUrl}: PdfToImagesPayload): Promise<PdfToImagesResult> {
        const response = await fetch(pdfUrl)
        const buffer = await response.buffer()
        const pdf2pic = pdf2picFromBuffer(buffer)
        const images: string[] = []
        for (const image of await pdf2pic.bulk(-1, {responseType: 'base64'})) {
            if (image.base64) images.push(image.base64)
        }
        return {images}
    }
})