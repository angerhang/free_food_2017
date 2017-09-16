import { Router, Request, Response } from 'express';
import { ApiController } from './../controllers/ApiController';
import * as multer from 'multer';

const router: Router = Router();

const upload = multer({ dest: './uploads', storage: multer.memoryStorage() });

const apiController: ApiController = new ApiController();

router.post('/food/score', upload.single('file'), (req: Request, res: Response) => {
    apiController.calculateScore(req, res);
});

router.get('/food/ping', (req: Request, res: Response) => {
    ApiController.ping(req, res);
});

export const apiRoute: Router = router;
