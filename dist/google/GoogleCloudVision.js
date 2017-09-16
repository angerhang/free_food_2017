"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vision = require("@google-cloud/vision");
/**
 * Wrapper for the Google Cloud Vision API
 */
class GoogleCloudVision {
    constructor() {
        const config = { keyFilename: './gcv-key.json' };
        this.client = vision(config);
    }
    detectLabels(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageDefinition = {
                content: image.toString('base64'),
            };
            return this.client.labelDetection(imageDefinition).then(this.extractLabels);
        });
    }
    extractLabels(labelResponses) {
        const labels = [];
        labelResponses.forEach((labelResponse) => {
            labelResponse.labelAnnotations.forEach((label) => {
                labels.push(label);
            });
        });
        return labels;
    }
}
exports.GoogleCloudVision = GoogleCloudVision;
//# sourceMappingURL=GoogleCloudVision.js.map