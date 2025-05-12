import express from "express";
const router = express.Router();

import {NutritionEstimator} from "./estimate.routes.js";
router.use("/estimate-nutrition", NutritionEstimator);

export default router;
