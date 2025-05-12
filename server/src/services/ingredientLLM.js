const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("./logger");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function getIngredientsFromLLM(dishName) {
  const prompt = `
  Dish: "${dishName}"
  Give main ingredients with approximate household quantity. Respond only in JSON like:
  [
    { "name": "jeera", "quantity": "1 tsp" },
    { "name": "aloo", "quantity": "2 medium" },
    ...
  ]`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    const ingredients = JSON.parse(response);
    logger.log(`Used Gemini for ingredient extraction for: ${dishName}`);
    return ingredients;
  } catch (err) {
    logger.log(`Gemini failed for: ${dishName} — ${err.message}`);
    return [];
  }
}

export { getIngredientsFromLLM };
