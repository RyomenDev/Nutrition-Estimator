// /services/unitConverter.js

const densityMap = {
  oil: 13, // grams per tbsp
  sugar: 12.5,
  salt: 18,
  jeera: 2,
  rice: 195, // per cup
  water: 240, // per glass
  aloo: 150, // per medium
  onion: 100, // per medium
  capsicum: 120, // per medium
  default: 10,
};

function parseQuantity(quantityStr) {
  if (!quantityStr) return 1;

  const match = quantityStr.match(/[\d.]+/g);
  return match ? parseFloat(match[0]) : 1;
}

function getUnit(quantityStr) {
  const unit = quantityStr.toLowerCase();
  if (unit.includes("tbsp")) return "tbsp";
  if (unit.includes("tsp")) return "tsp";
  if (unit.includes("cup")) return "cup";
  if (unit.includes("glass")) return "glass";
  if (unit.includes("medium")) return "medium";
  if (unit.includes("small")) return "small";
  return "unit";
}

function convertToGrams(ingredientName, quantityStr) {
  const qty = parseQuantity(quantityStr);
  const unit = getUnit(quantityStr);

  const name = ingredientName.toLowerCase();
  let base = densityMap[name] || densityMap.default;

  switch (unit) {
    case "tbsp":
    case "tsp":
    case "cup":
    case "glass":
    case "medium":
      // base density assumed as per unit
      break;
    case "unit":
      base = 100;
      break;
    default:
      break;
  }

  return qty * base;
}

module.exports = { convertToGrams };
