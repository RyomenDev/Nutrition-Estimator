import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

export async function extractDishInfoFromInput(userInput) {
  const prompt = `
    You are a structured food data assistant.
    
    From the user query below, extract and return **only valid JSON** in this exact format:
    
    {
      "dishName": "<string>",
      "intent": "<get_nutrition | estimate_ingredients | ask_recipe>",
      "details": "<string or null>",
      "dishType": "<string>",
      "ingredients_used": [
        { "name": "<string>", "quantity": "<string>" }
      ],
      "nutrition_per_serving": {
        "calories_kcal": <number>,
        "energy_kj": <number>,
        "protein_g": <number>,
        "carbs_g": <number>,
        "fat_g": <number>,
        "fiber_g": <number>,
        "free_sugar_g": <number>
      },
      "assumptions": ["<string>", "<string>"]
    }
    
    ❗ All fields must be filled with realistic estimates if not explicitly mentioned. Do not leave any array empty.
    
    **Reasoning Task**: If the user query requests reasoning, please solve **1 of these** tasks and include the explanation in the response:
    
    1. **Map "lightly roasted jeera powder" to a nutrition entry**: Manually solve why lightly roasted jeera powder would be used in a dish, estimate its calorie and macro breakdown, and explain its reasoning (such as assuming standard amounts per teaspoon, or knowing its typical macro content).
    2. **Dish weight is 700g cooked, and raw ingredient weight totals 950g**: What’s the loss ratio? Separate the reasoning for calculating the loss ratio and adjust the final nutrient values to a standard 180g serving size, assuming total nutrition was calculated for the full cooked quantity.
    
    Examples:
    
    User: "Give me macros for 2 bowls of rajma chawal"
    →
    {
      "dishName": "Rajma Chawal",
      "intent": "get_nutrition",
      "details": "2 bowls",
      "dishType": "Wet Curry",
      "ingredients_used": [
        { "name": "Rajma (kidney beans)", "quantity": "100g" },
        { "name": "Cooked Rice", "quantity": "150g" },
        { "name": "Onion", "quantity": "50g" },
        { "name": "Tomato", "quantity": "60g" }
      ],
      "nutrition_per_serving": {
        "calories_kcal": 320,
        "energy_kj": 1340,
        "protein_g": 12,
        "carbs_g": 48,
        "fat_g": 8,
        "fiber_g": 6,
        "free_sugar_g": 3
      },
      "assumptions": [
        "Serving size assumed to be 1 bowl = 250g",
        "Rajma prepared with minimal oil",
        "Used standard Punjabi-style preparation"
      ]
    }
    
    Now analyze and respond with valid JSON only (no text or explanation).
    
    User: "${userInput}"
    `;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const rawText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}") + 1;
    const jsonText = rawText.slice(jsonStart, jsonEnd);

    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (error) {
    console.error("Gemini parsing failed:", error.message);
    return {
      dishName: null,
      intent: "unknown",
      details: userInput,
      error: "Failed to extract structured info",
    };
  }
}

export async function getAliasesForIngredient(ingredientName) {
  const prompt = `
      Provide 4 common aliases or alternate names (including English terms if applicable) for the ingredient: "${ingredientName}". Respond with only a JSON array of strings.
    
      Example:
      Input: "rajma"
      Output: ["rajma", "kidney beans", "red beans", "haricot beans"]
      `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const rawText =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const jsonStart = rawText.indexOf("[");
    const jsonEnd = rawText.lastIndexOf("]") + 1;
    const jsonText = rawText.slice(jsonStart, jsonEnd);

    const parsed = JSON.parse(jsonText);

    // Return the ingredient name along with the aliases
    return [ingredientName, ...parsed];
  } catch (err) {
    console.error(`Alias fetch failed for '${ingredientName}':`, err.message);
    return [ingredientName]; // fallback to original
  }
}

/*
const prompt = `
You are a structured food data assistant.

From the user query below, extract and return **only valid JSON** in this exact format:

{
  "dishName": "<string>",
  "intent": "<get_nutrition | estimate_ingredients | ask_recipe>",
  "details": "<string or null>",
  "dishType": "<string>",
  "ingredients_used": [
    { "name": "<string>", "quantity": "<string>" }
  ],
  "nutrition_per_serving": {
    "calories_kcal": <number>,
    "energy_kj": <number>,
    "protein_g": <number>,
    "carbs_g": <number>,
    "fat_g": <number>,
    "fiber_g": <number>,
    "free_sugar_g": <number>
  },
  "assumptions": ["<string>", "<string>"]
}

❗ All fields must be filled with realistic estimates if not explicitly mentioned. Do not leave any array empty.

Examples:

User: "Give me macros for 2 bowls of rajma chawal"
→
{
  "dishName": "Rajma Chawal",
  "intent": "get_nutrition",
  "details": "2 bowls",
  "dishType": "Wet Curry",
  "ingredients_used": [
    { "name": "Rajma (kidney beans)", "quantity": "100g" },
    { "name": "Cooked Rice", "quantity": "150g" },
    { "name": "Onion", "quantity": "50g" },
    { "name": "Tomato", "quantity": "60g" }
  ],
  "nutrition_per_serving": {
    "calories_kcal": 320,
    "energy_kj": 1340,
    "protein_g": 12,
    "carbs_g": 48,
    "fat_g": 8,
    "fiber_g": 6,
    "free_sugar_g": 3
  },
  "assumptions": [
    "Serving size assumed to be 1 bowl = 250g",
    "Rajma prepared with minimal oil",
    "Used standard Punjabi-style preparation"
  ]
}

Now analyze and respond with valid JSON only (no text or explanation).

User: "${userInput}"
`;
*/
