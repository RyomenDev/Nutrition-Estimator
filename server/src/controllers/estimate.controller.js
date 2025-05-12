import express from "express";
const router = express.Router();
import {
  extractDishInfoFromInput,
  getAliasesForIngredient,
} from "../services/gemini.service.js";
import {
  loadFoodData,
  calculateNutritionPerServing,
} from "../utils/excelParser.js";

const NutritionEstimator = async (req, res) => {
  const { dishName } = req.body;

  if (!dishName) {
    return res.status(400).json({ error: "User input is required" });
  }

  try {
    const parsed = await extractDishInfoFromInput(dishName);

    if (!parsed.dishName) {
      return res.status(422).json({
        error: "Dish name could not be extracted from input",
        parsed,
      });
    }

    // Fetch aliases for all ingredients
    const aliasPromises = parsed.ingredients_used.map((i) =>
      getAliasesForIngredient(i.name)
    );

    const aliasResults = await Promise.all(aliasPromises);

    // Flatten and deduplicate
    const allIngredientAliases = [
      ...new Set(aliasResults.flat().map((name) => name.toLowerCase())),
    ];
    // console.log("Generated aliases: ", allIngredientAliases);
    // Load nutrition dataset
    const foodData = loadFoodData();

    const recalculatedNutrition = calculateNutritionPerServing(
      allIngredientAliases,
      foodData
    );
    // console.log({ recalculatedNutrition });

    const response = {
      dish: parsed.dishName,
      type: parsed.dishType || "Unknown",
      intent: parsed.intent,
      details: parsed.details,
      estimated_nutrition_from_excel: recalculatedNutrition,
      nutrition_per_serving: parsed.nutrition_per_serving || {},
      //   nutrition_per_serving: nutrition,
      assumptions: parsed.assumptions || [],
      ingredients_used: parsed.ingredients_used || [],
      parsed, // Optional: for Debugging or UI use
    };
    return res.json(response);
  } catch (error) {
    console.error("Estimation error:", error);
    return res.status(500).json({ error: "Failed to estimate nutrition" });
  }
};

export { NutritionEstimator };
