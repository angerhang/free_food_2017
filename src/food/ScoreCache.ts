import * as fs from 'fs';
import { isUndefined } from 'util';

interface LabelScore {
    label: string;
    score: number;
}

interface DataCache {
    scores: LabelScore[];
}

export class ScoreCache {
    private cache: Map<string, number>;
    constructor() {
        this.initCache();
    }

    private initCache() {
        fs.readFile('data.json', (err, data) => {
            if (err != null) {
                throw err;
            } else {
                const importedData: DataCache = JSON.parse(data.toString());
                this.cache = new Map<string, number>();
                importedData.scores.forEach((score: LabelScore) => {
                    this.cache.set(score.label, score.score);
                });
            }
        });
    }

    public getScoreForLabel(label: string): number {
        let score = this.cache.get(label);
        if (isUndefined(score)) {
            score = -1;
        }
        console.log('Getting score for ' + label + ': ' + score);
        return score;
    }

}
