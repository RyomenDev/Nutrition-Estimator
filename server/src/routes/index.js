import express from "express";
const router = express.Router();

import {NutritionEstimator} from "../controllers/estimate.controller.js";
router.use("/estimate-nutrition", NutritionEstimator);

export default router;
