import * as vision from './../google/GoogleCloudVision';
import { ScoreCache } from './ScoreCache';
import * as _ from 'lodash';
import { Label } from '../types/@google-cloud/vision/index';

export interface ScoreResult {
    score: number;
    labels: string[];
}

/**
 * Calculates food score based on images
 */
export class FoodCalculator {
    private gcv: vision.GoogleCloudVision;
    private static cache: ScoreCache;

    constructor() {
        this.gcv = new vision.GoogleCloudVision();
        if (FoodCalculator.cache == null) {
            FoodCalculator.cache = new ScoreCache();
        }
    }

    public async getScoreForImage(data: Buffer): Promise<ScoreResult> {
        return this.gcv.detectLabels(data).then((visionLabels: Label[]) => {
            let sum: number = 0;
            let labelCount: number = 0;
            const labels: string[] = [];
            _.chain(visionLabels)
                .filter((label: Label) => {
                    return label.score >= 0.7;
                }).map((label: Label) => {
                    const score: number = FoodCalculator.cache.getScoreForLabel(label.description);
                    return new LabelScore(label.description, score);
                }).filter((labelScore: LabelScore) => {
                    return labelScore.score !== -1;
                }).map((labelScore: LabelScore) => {
                    sum += labelScore.score;
                    labels.push(labelScore.label);
                    labelCount += 1;
                    return labelScore;
                }).value();
            let scoreResult: number = sum;
            if (labelCount !== 0) {
                scoreResult = scoreResult / labelCount;
            }
            return {
                labels,
                score: scoreResult,
            };
        });
    }
}

class LabelScore {
    public label: string;
    public score: number;

    constructor(label: string, score: number) {
        this.label = label;
        this.score = score;
    }
}
