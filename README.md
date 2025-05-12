## 🧠 Project Title: Nutrition Estimator with Gemini + Excel Dataset Matching
## 📌 Project Overview:
Developed a full-stack nutrition estimator application that uses **Gemini (LLM)** to extract ingredients and serving data from user input, and then matches these ingredients to a **locally stored nutrition database** (Excel) to compute estimated nutritional values per serving. The project combines natural language **understanding, alias matching using LLM, and fuzzy string comparison** to accurately calculate nutrition information for Indian dishes and user-defined meals.

## 🛠 What You Implemented:
**1- Gemini-Powered Ingredient Extraction:**

- Used Gemini API to parse the user input (dish name or description) into structured data: dish name, ingredients used, intent, serving size, and assumptions.

**2- Alias Generation Using Gemini:**

- For each ingredient, a secondary Gemini call was made to generate up to **4 common aliases or alternate names**, including English terms. This was to improve matching accuracy against your Excel dataset.

**3- Excel Dataset Integration:**

- Parsed a custom Excel file (IFCT 2017 based) using xlsx, extracting and cleaning food items with fields like `energy_kcal, protein_g, carb_g, fibre_g, etc`.

**4- Fuzzy Matching with string-similarity:**

- Compared user-provided (and alias-enhanced) ingredient names with food names from the Excel dataset using string similarity, with a confidence threshold for matching.

**5- Nutrition Calculation Logic:**

- Computed aggregate nutrition per serving based on matched food items and returned a complete breakdown of macronutrients.

**6- Express API Endpoint:**

- Built a dedicated NutritionEstimator endpoint in Express.js that ties all components together and returns a detailed JSON response.

## ⚠️ Challenges Faced & Resolutions:
**1. Challenge: Inconsistent Ingredient Naming**
- **Problem:** Users input ingredients with regional or colloquial names (e.g., rajma, baingan, chana), while the Excel dataset used scientific/English names.

- **Solution:** Made a separate Gemini API call to generate multiple aliases per ingredient. This expanded the matching vocabulary and drastically improved hit rate against the database.

**2. Challenge: Low Matching Accuracy**
- **Problem:** Direct string matching failed due to slight spelling variations or different word orders.

- **Solution:** Used string-similarity to find the best match for each alias, with a confidence threshold (e.g., >0.8) to reduce false positives.

**3. Challenge: Parsing Gemini Responses**
- **Problem:** Gemini sometimes returned explanations or wrapped JSON in text, making parsing difficult.

- **Solution:** Extracted JSON content from within the full response using string slicing and error-handled parsing to prevent crashes.

**4. Challenge: Handling Missing Data**
- **Problem:** Some ingredients had no direct match in the dataset.

- **Solution:** Returned a fallback using the original ingredient name or skipped low-confidence matches to maintain data integrity.

**5. Challenge: Working with Excel Data in ESM**
- **Problem:** Using __dirname in ES modules for path resolution was non-trivial.

- **Solution:** Used fileURLToPath and path.dirname to resolve paths in an ESM-compatible way.

## 🚀 Skills & Tools Used:
- Node.js, Express.js
- Google Gemini API
- Excel Parsing with xlsx
- String Matching with string-similarity
- JavaScript (ESM modules)
- Data normalization and transformation

