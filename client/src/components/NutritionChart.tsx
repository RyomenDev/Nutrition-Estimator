
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

type GeminiNutritionData = {
  calories_kcal: number;
  energy_kj: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  free_sugar_g: number;
};
type ExcelNutritionData = {
  energy_kcal: number;
  energy_kj: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  freesugar_g: number;
};

type NutritionChartProps = {
  geminiData: GeminiNutritionData;
  excelData: ExcelNutritionData;
};

const NutritionChart = ({ geminiData, excelData }: NutritionChartProps) => {
  const isMobile = useIsMobile();
  console.log({geminiData,excelData});
  

  const chartData = [
    {
      name: "Calories (kcal)",
      Gemini: geminiData.calories_kcal,
      Excel: excelData.energy_kcal,
    },
    {
      name: "Energy (kJ)",
      Gemini: geminiData.energy_kj,
      Excel: excelData.energy_kj,
    },
    {
      name: "Protein (g)",
      Gemini: geminiData.protein_g,
      Excel: excelData.protein_g,
    },
    {
      name: "Carbs (g)",
      Gemini: geminiData.carbs_g,
      Excel: excelData.carbs_g,
    },
    {
      name: "Fat (g)",
      Gemini: geminiData.fat_g,
      Excel: excelData.fat_g,
    },
    {
      name: "Fiber (g)",
      Gemini: geminiData.fiber_g,
      Excel: excelData.fiber_g,
    },
    {
      name: "Free Sugar (g)",
      Gemini: geminiData.free_sugar_g,
      Excel: excelData.freesugar_g,
    },
  ];

  return (
    <div className="w-full h-[400px] bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-center mb-3">
        Nutrition Comparison (Gemini vs Excel)
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
          <YAxis fontSize={isMobile ? 10 : 12} />
          <Tooltip
            formatter={(value) => [`${value}`, "Value"]}
            contentStyle={{ borderRadius: "8px" }}
          />
          <Legend />
          <Bar dataKey="Gemini" fill="#3498DB" />
          <Bar dataKey="Excel" fill="#2ECC71" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionChart;
  

