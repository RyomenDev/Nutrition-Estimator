import express from "express";
const router = express.Router();
import {
  fetchIngredients,
  convertUnits,
  mapToNutrition,
  estimateGrams,
  calculateNutrition,
  detectDishType,
} from "../services/nutritionCalculator.js";
import {log as logger} from "../services/logger.js";

// router.post("/", async (req, res) => {
//   const { dishName } = req.body;
//   try {
//     const ingredients = await fetchIngredients(dishName);
//     const standardized = await convertUnits(ingredients);
//     const mapped = await mapToNutrition(standardized);
//     const grams = await estimateGrams(mapped);
//     const nutrition = await calculateNutrition(grams);
//     const dishType = detectDishType(dishName);

//     const assumptions = logger.getAssumptions();

//     res.json({
//       dish: dishName,
//       type: dishType,
//       nutrition_per_katori: nutrition,
//       assumptions,
//     });
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: "Something went wrong", details: err.message });
//   }
// });

const NutritionEstimator = async (req, res) => {
  const { dishName } = req.body;

  if (!dishName) {
    return res.status(400).json({ error: "Dish name is required" });
  }

  try {
    // === Real logic will eventually go here ===

    const response = {
      dish: dishName,
      type: "Wet Curry",
      nutrition_per_katori: {
        calories: 198,
        protein: 6.3,
        carbs: 22.1,
        fat: 9.7,
        fiber: 3.1,
      },
      assumptions: [
        "Assumed 1 katori = 180g",
        "Estimated oil as 1 tbsp",
        "Used generic recipe for dish",
        "Mapped 'jeera' to 'cumin seeds'",
      ],
      ingredients_used: [
        { name: "Paneer", quantity: "100g" },
        { name: "Butter", quantity: "1 tbsp" },
        { name: "Tomato", quantity: "50g" },
      ],
    };

    return res.json(response);
  } catch (error) {
    console.error("Estimation error:", error);
    return res.status(500).json({ error: "Failed to estimate nutrition" });
  }
};

export { NutritionEstimator };

// module.exports = router;
