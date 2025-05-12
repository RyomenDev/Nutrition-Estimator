import { loadNutritionDB as nutritionDB } from "../utils/excelParser.js";
import {log as logger} from "./logger.js";

async function fetchIngredients(dishName) {
  // Simulate or use LLM — placeholder below
  logger.log(`Fetched ingredients for ${dishName}`);
  return [
    { name: "jeera", quantity: "1 tsp" },
    { name: "aloo", quantity: "2 medium" },
    { name: "oil", quantity: "1 tbsp" },
  ];
}

async function convertUnits(ingredients) {
  // Convert tsp, tbsp, glass → grams (use ingredient-specific logic)
  logger.log("Converted household units to grams");
  return ingredients.map((item) => ({
    ...item,
    grams: convertToGrams(item.name, item.quantity),
  }));
}

function convertToGrams(name, quantity) {
  // Dummy values for now
  const densities = { jeera: 2, aloo: 150, oil: 13 };
  // TODO: parse "2 medium", "1 tbsp"
  return densities[name] || 10;
}

async function mapToNutrition(ingredients) {
  const db = await nutritionDB.loadNutritionDB();
  // Match using synonyms, spellcheck, etc.
  logger.log("Mapped ingredients to nutrition DB");
  return ingredients.map((i) => {
    const match = db.find((d) => d.food_name.includes(i.name));
    if (!match) logger.log(`Missing match for ${i.name}`);
    return { ...i, nutritionData: match || {} };
  });
}

async function estimateGrams(ingredients) {
  logger.log("Estimated total grams");
  return ingredients;
}

async function calculateNutrition(ingredients) {
  const total = { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 };
  ingredients.forEach((item) => {
    const ratio = item.grams / 100;
    total.calories += (item.nutritionData.energy_kcal || 0) * ratio;
    total.protein += (item.nutritionData.protein_g || 0) * ratio;
    total.fat += (item.nutritionData.fat_g || 0) * ratio;
    total.carbs += (item.nutritionData.carb_g || 0) * ratio;
    total.fiber += (item.nutritionData.fibre_g || 0) * ratio;
  });

  // Scale to 1 katori (assume 180g)
  const scale = 180 / ingredients.reduce((acc, i) => acc + (i.grams || 0), 0);
  Object.keys(total).forEach(
    (key) => (total[key] = +(total[key] * scale).toFixed(2))
  );

  return total;
}

function detectDishType(dishName) {
  const wetList = ["curry", "masala", "sabzi"];
  return wetList.some((word) => dishName.toLowerCase().includes(word))
    ? "Wet Sabzi"
    : "Dry Sabzi";
}

export {
  fetchIngredients,
  convertUnits,
  mapToNutrition,
  estimateGrams,
  calculateNutrition,
  detectDishType,
};
