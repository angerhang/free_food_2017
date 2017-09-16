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
const vision = require("./../google/GoogleCloudVision");
const ScoreCache_1 = require("./ScoreCache");
const _ = require("lodash");
/**
 * Calculates food score based on images
 */
class FoodCalculator {
    constructor() {
        this.gcv = new vision.GoogleCloudVision();
        if (FoodCalculator.cache == null) {
            FoodCalculator.cache = new ScoreCache_1.ScoreCache();
        }
    }
    getScoreForImage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.gcv.detectLabels(data).then((visionLabels) => {
                let sum = 0;
                let labelCount = 0;
                const labels = [];
                _.chain(visionLabels)
                    .filter((label) => {
                    return label.score >= 0.7;
                }).map((label) => {
                    const score = FoodCalculator.cache.getScoreForLabel(label.description);
                    return new LabelScore(label.description, score);
                }).filter((labelScore) => {
                    return labelScore.score !== -1;
                }).map((labelScore) => {
                    sum += labelScore.score;
                    labels.push(labelScore.label);
                    labelCount += 1;
                    return labelScore;
                }).value();
                let scoreResult = sum;
                if (labelCount !== 0) {
                    scoreResult = scoreResult / labelCount;
                }
                return {
                    labels,
                    score: scoreResult,
                };
            });
        });
    }
}
exports.FoodCalculator = FoodCalculator;
class LabelScore {
    constructor(label, score) {
        this.label = label;
        this.score = score;
    }
}
//# sourceMappingURL=FoodCalculator.js.map