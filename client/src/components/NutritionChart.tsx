
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

type NutritionData = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
};

type NutritionChartProps = {
  data: NutritionData;
};

const NutritionChart = ({ data }: NutritionChartProps) => {
  const isMobile = useIsMobile();
  
  const chartData = [
    { name: "Protein", value: data.protein, color: "#2ECC71" },
    { name: "Carbs", value: data.carbs, color: "#F9A826" },
    { name: "Fat", value: data.fat, color: "#E67E22" },
    { name: "Fiber", value: data.fiber, color: "#8E44AD" },
  ];

  return (
    <div className="w-full h-72 bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-center mb-3">Nutrition Breakdown (g)</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={isMobile ? 10 : 12} />
          <YAxis fontSize={isMobile ? 10 : 12} />
          <Tooltip
            formatter={(value) => [`${value}g`, "Amount"]}
            contentStyle={{ borderRadius: "8px" }}
          />
          <Legend />
          <Bar dataKey="value" fill="#F9A826">
            {chartData.map((entry, index) => (
              <Bar key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionChart;
