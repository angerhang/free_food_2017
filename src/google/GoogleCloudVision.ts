
import * as vision from '@google-cloud/vision';

/**
 * Wrapper for the Google Cloud Vision API
 */
export class GoogleCloudVision {
    private client: vision.VisionClient;
    constructor() {
        const config: vision.Config = { keyFilename: './gcv-key.json' };
        this.client = vision(config);
    }

    public async detectLabels(image: Buffer): Promise<vision.Label[]> {
        const imageDefinition: vision.ImageDefinition = {
            content: image.toString('base64'),
        };
        return this.client.labelDetection(imageDefinition).then(this.extractLabels);
    }

    private extractLabels(labelResponses: vision.LabelResponse[]): vision.Label[] {
        const labels: vision.Label[] = [];
        labelResponses.forEach((labelResponse: vision.LabelResponse)  => {
            labelResponse.labelAnnotations.forEach((label: vision.Label) => {
                labels.push(label);
            });
        });

        return labels;
    }

}
