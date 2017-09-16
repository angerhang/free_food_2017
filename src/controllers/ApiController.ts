import { Request, Response } from 'express';
import * as food from './../food/FoodCalculator';

export class ApiController {
    foodCalculator: food.FoodCalculator;
    constructor() {
        this.foodCalculator = new food.FoodCalculator();
    }

    public calculateScore(req: Request, res: Response): void {
        const file = req.file;
        if (file == null || file.size === 0) {
            res.status(400).json({
                error: true,
                message: 'I am missing a file...',
            });
            return;
        }
        this.foodCalculator.getScoreForImage(file.buffer).then((result: food.ScoreResult) => {
            res.json({ score: result.score, labels: result.labels });
        }).catch((reason: any) => {
            console.log('an error occured: ' + reason);
            res.status(500).json({
                error: true,
                message: 'I am so sorry',
            });
        });
    }

    public static ping(req: Request, res: Response): void {
        console.log('pong');
        res.json({ });
    }
}
