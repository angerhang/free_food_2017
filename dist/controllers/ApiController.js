"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const food = require("./../food/FoodCalculator");
class ApiController {
    constructor() {
        this.foodCalculator = new food.FoodCalculator();
    }
    calculateScore(req, res) {
        const file = req.file;
        if (file == null || file.size === 0) {
            res.status(400).json({
                error: true,
                message: 'I am missing a file...',
            });
            return;
        }
        this.foodCalculator.getScoreForImage(file.buffer).then((result) => {
            res.json({ score: result.score, labels: result.labels });
        }).catch((reason) => {
            console.log('an error occured: ' + reason);
            res.status(500).json({
                error: true,
                message: 'I am so sorry',
            });
        });
    }
    static ping(req, res) {
        console.log('pong');
        res.json({});
    }
}
exports.ApiController = ApiController;
//# sourceMappingURL=ApiController.js.map