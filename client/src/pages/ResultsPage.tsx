
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NutritionChart from "@/components/NutritionChart";
import NutritionCard from "@/components/NutritionCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorFallback from "@/components/ErrorFallback";
import DebugPanel from "@/components/DebugPanel";

type NutritionResponse = {
  dish: string;
  type: string;
  nutrition_per_serving: {
    calories_kcal: number;
    energy_kj: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    free_sugar_g: number;
  };
  estimated_nutrition_from_excel: {
    calories_kcal: number;
    energy_kj: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    free_sugar_g: number;
  };
  assumptions: string[];
  ingredients_used: { name: string; quantity: string }[];
  details: string | null;
};

const baseURL= import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://localhost:3000/api";

const ResultsPage = () => {
  const dishName = localStorage.getItem("dishName") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nutrition, setNutrition] = useState<NutritionResponse | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const showDebug =
    new URLSearchParams(location.search).get("debug") === "true";

  const requestData = {
    url: `${baseURL}/estimate-nutrition`,
    method: "POST",
    body: { dishName },
    headers: { "Content-Type": "application/json" },
  };

  useEffect(() => {
    if (!dishName) {
      setError("No dish specified");
      setLoading(false);
      return;
    }

    const fetchNutrition = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(requestData.url, {
          method: "POST",
          headers: requestData.headers,
          body: JSON.stringify(requestData.body),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch nutrition data");
        }

        const data = await response.json();
        // console.log({ data });

        setNutrition(data);
      } catch (err: any) {
        setError(err.message || "Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNutrition();
  }, [dishName]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !nutrition) {
    return (
      <ErrorFallback
        error={error || "No nutrition data available"}
        resetErrorBoundary={() => {
          setError(null);
          setLoading(true);
          navigate(`/results`);
        }}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-indian-brown">
          {nutrition.dish}
        </h2>
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="border-indian-saffron text-indian-saffron hover:bg-indian-saffron/10"
        >
          Try Another Dish
        </Button>
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-md p-6 mb-8">
        <div className="mb-4">
          <span className="inline-block bg-indian-turmeric/20 text-indian-turmeric px-3 py-1 rounded-full text-sm font-medium">
            {nutrition.type}
          </span>
          <h3 className="text-xl font-semibold mt-2 text-indian-brown">
            Nutrition per Serving
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <NutritionCard
            title="Calories"
            value={nutrition.nutrition_per_serving.calories_kcal}
            unit="kcal"
            color="#E74C3C"
            icon="🔥"
          />
          <NutritionCard
            title="Protein"
            value={nutrition.nutrition_per_serving.protein_g}
            unit="g"
            color="#2ECC71"
            icon="🥩"
          />
          <NutritionCard
            title="Carbs"
            value={nutrition.nutrition_per_serving.carbs_g}
            unit="g"
            color="#F9A826"
            icon="🌾"
          />
          <NutritionCard
            title="Fat"
            value={nutrition.nutrition_per_serving.fat_g}
            unit="g"
            color="#E67E22"
            icon="🧈"
          />
          <NutritionCard
            title="Fiber"
            value={nutrition.nutrition_per_serving.fiber_g}
            unit="g"
            color="#8E44AD"
            icon="🥦"
          />
          <NutritionCard
            title="Free Sugar"
            value={nutrition.nutrition_per_serving.free_sugar_g}
            unit="g"
            color="#E91E63"
            icon="🍬"
          />
        </div>

        <NutritionChart data={nutrition.nutrition_per_serving} />

        {/* Nutrition Comparison Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-indian-brown mb-4">
            Gemini vs Excel Nutrition Estimate
          </h3>
          {Object.values(nutrition.estimated_nutrition_from_excel).every(
            (val) => val === 0
          ) ? (
            <p className="text-red-500">Excel-based estimate not available.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
              <div className="font-semibold text-sm text-gray-600">Metric</div>
              <div className="font-semibold text-sm text-indigo-700">
                Gemini
              </div>
              <div className="font-semibold text-sm text-green-700">Excel (per 100gm)</div>
              <div className="col-span-3 hidden md:block" />

              {[
                "Calories",
                "Protein",
                "Carbs",
                "Fat",
                "Fiber",
                "Free Sugar",
              ].map((label, index) => {
                const keyMap = [
                  "calories_kcal",
                  "protein_g",
                  "carbs_g",
                  "fat_g",
                  "fiber_g",
                  "free_sugar_g",
                ];
                const labelKey = keyMap[index];
                const excelKeyMap: Record<string, string> = {
                  calories_kcal: "energy_kcal",
                  protein_g: "protein_g",
                  carbs_g: "carb_g",
                  fat_g: "fat_g",
                  fiber_g: "fibre_g",
                  free_sugar_g: "freesugar_g",
                };

                const excelKey = excelKeyMap[
                  labelKey
                ] as keyof typeof nutrition.estimated_nutrition_from_excel;
                const excelValue =
                  nutrition.estimated_nutrition_from_excel[excelKey];
                const geminiValue =
                  nutrition.nutrition_per_serving[
                    labelKey as keyof typeof nutrition.nutrition_per_serving
                  ];

                return (
                  <div key={index} className="contents">
                    <div className="text-sm">{label}</div>
                    <div className="text-indigo-700 font-medium">
                      {geminiValue}
                    </div>
                    <div className="text-green-700 font-medium">
                      {excelValue}
                    </div>
                    <div className="col-span-3 hidden md:block" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-indian-brown">
            Assumptions Made
          </h3>
          <ul className="space-y-2">
            {nutrition.assumptions.map((assumption, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-indian-brown/80"
              >
                <span className="text-indian-saffron">•</span>
                {assumption}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3 text-indian-brown">
            Ingredients Used
          </h3>
          <ul className="space-y-2">
            {nutrition.ingredients_used.map((ingredient, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-indian-brown/80"
              >
                <span className="text-indian-saffron">•</span>
                {ingredient.name}: {ingredient.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showDebug && (
        <DebugPanel requestData={requestData} responseData={nutrition} />
      )}
    </div>
  );
};

export default ResultsPage;


