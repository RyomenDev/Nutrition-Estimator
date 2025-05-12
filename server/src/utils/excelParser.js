import xlsx from "xlsx";
let dbCache = [];

async function loadNutritionDB() {
  if (dbCache.length > 0) return dbCache;
  const workbook = xlsx.readFile("./data/nutrition_db.xlsx");
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const json = xlsx.utils.sheet_to_json(sheet);
  dbCache = json.map((row) => ({
    food_name: row["food_name_.primarysource"]?.toLowerCase() || "",
    energy_kcal: +row.energy_kcal || 0,
    carb_g: +row.carb_g || 0,
    protein_g: +row.protein_g || 0,
    fat_g: +row.fat_g || 0,
    fibre_g: +row.fibre_g || 0,
  }));
  return dbCache;
}

export { loadNutritionDB };
