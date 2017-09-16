"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util_1 = require("util");
class ScoreCache {
    constructor() {
        this.initCache();
    }
    initCache() {
        fs.readFile('data.json', (err, data) => {
            if (err != null) {
                throw err;
            }
            else {
                const importedData = JSON.parse(data.toString());
                this.cache = new Map();
                importedData.scores.forEach((score) => {
                    this.cache.set(score.label, score.score);
                });
            }
        });
    }
    getScoreForLabel(label) {
        let score = this.cache.get(label);
        if (util_1.isUndefined(score)) {
            score = -1;
        }
        console.log('Getting score for ' + label + ': ' + score);
        return score;
    }
}
exports.ScoreCache = ScoreCache;
//# sourceMappingURL=ScoreCache.js.map