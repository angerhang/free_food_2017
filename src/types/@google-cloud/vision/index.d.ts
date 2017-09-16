declare function visionV1(options?: visionV1.Config ): visionV1.VisionClient;

declare namespace visionV1 {
    interface Config {
        keyFilename: string;
    }

    interface ImageDefinition {
        content: string;
    }

    export interface Label {
        description: string;
        score: number;
    }

    interface LabelResponse {
        labelAnnotations: Label[];
    }

    interface VisionClient {
        labelDetection(image: ImageDefinition): Promise<LabelResponse[]>;
    }
}

export = visionV1;
