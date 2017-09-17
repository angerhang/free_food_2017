"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ApiController_1 = require("./../controllers/ApiController");
const multer = require("multer");
const router = express_1.Router();
const upload = multer({ dest: './uploads', storage: multer.memoryStorage() });
const apiController = new ApiController_1.ApiController();
router.post('/food/score', upload.single('file'), (req, res) => {
    apiController.calculateScore(req, res);
});
router.get('/food/ping', (req, res) => {
    ApiController_1.ApiController.ping(req, res);
});
exports.apiRoute = router;
//# sourceMappingURL=api.js.map