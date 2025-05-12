import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import xlsx from "xlsx";
import stringSimilarity from "string-similarity";

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load food data from Excel
export const loadFoodData = () => {
  const filePath = path.join(__dirname, "../../nutrition_db.xlsx");

  if (!fs.existsSync(filePath)) {
    throw new Error("Excel file not found at: " + filePath);
  }

  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: "",
  });

  // Process food data
  return jsonData.map((item) => ({
    food_name: item["food_name"]?.toLowerCase().trim(),
    energy_kcal: Number(item["energy_kcal"]) || 0,
    energy_kj: Number(item["energy_kj"]) || 0,
    carb_g: Number(item["carb_g"]) || 0,
    protein_g: Number(item["protein_g"]) || 0,
    fat_g: Number(item["fat_g"]) || 0,
    fibre_g: Number(item["fibre_g"]) || 0,
    freesugar_g: Number(item["freesugar_g"]) || 0,
    source: item["primarysource"]?.toLowerCase().trim(),
    food_group: item["Primary food group"]?.toLowerCase().trim(),
  }));
};

// Normalize text
const normalizeText = (text) => {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
};

// Extract quantity and ingredient name
const parseIngredient = (ingredient) => {
  const match = ingredient.match(/([\d.]+)\s*(\w+)?\s*(.*)/);
  if (match) {
    const quantity = parseFloat(match[1]) || 1;
    const name = normalizeText(match[3] || match[2] || ingredient);
    return { quantity, name };
  } else {
    return { quantity: 1, name: normalizeText(ingredient) };
  }
};

// Calculate nutrition per serving
export const calculateNutritionPerServing = (ingredients, foodData) => {
  let totalNutrition = {
    energy_kcal: 0,
    energy_kj: 0,
    carb_g: 0,
    protein_g: 0,
    fat_g: 0,
    fibre_g: 0,
    freesugar_g: 0,
  };

  ingredients.forEach((ingredientRaw) => {
    const { quantity, name } = parseIngredient(ingredientRaw);

    const nameNormalized = normalizeText(name);

    // Find matching food — if ingredient name is contained in food name
    let matchedFood = null;
    for (const food of foodData) {
      if (food.food_name.includes(nameNormalized)) {
        matchedFood = food;
        break;
      }
    }

    // Fallback: use string similarity if no includes match
    if (!matchedFood) {
      const foodNames = foodData.map((food) => food.food_name);
      const bestMatch = stringSimilarity.findBestMatch(
        nameNormalized,
        foodNames
      );
      if (bestMatch.bestMatch.rating > 0.75) {
        matchedFood = foodData[bestMatch.bestMatchIndex];
      }
    }

    if (matchedFood) {
      // Sum nutrition scaled by quantity
      totalNutrition.energy_kcal += matchedFood.energy_kcal * quantity;
      totalNutrition.energy_kj += matchedFood.energy_kj * quantity;
      totalNutrition.carb_g += matchedFood.carb_g * quantity;
      totalNutrition.protein_g += matchedFood.protein_g * quantity;
      totalNutrition.fat_g += matchedFood.fat_g * quantity;
      totalNutrition.fibre_g += matchedFood.fibre_g * quantity;
      totalNutrition.freesugar_g += matchedFood.freesugar_g * quantity;

      //   console.log(
      //     `Matched "${ingredientRaw}" → "${matchedFood.food_name}" (qty: ${quantity})`
      //   );
    } else {
    //   console.warn(`No match found for: "${ingredientRaw}"`);
    }
  });

  return totalNutrition;
};
