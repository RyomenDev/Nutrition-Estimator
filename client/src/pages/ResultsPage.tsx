import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import NutritionChart from "@/components/NutritionChart";
import NutritionCard from "@/components/NutritionCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorFallback from "@/components/ErrorFallback";
import DebugPanel from "@/components/DebugPanel";

type NutritionResponse = {
  dish: string;
  type: string;
  nutrition_per_katori: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  assumptions: string[];
};

const ResultsPage = () => {
  const { dishName } = useParams<{ dishName: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nutrition, setNutrition] = useState<NutritionResponse | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const showDebug =
    new URLSearchParams(location.search).get("debug") === "true";

  // Mock request data for debug mode
  const requestData = {
    url: "http://localhost:3000/api/estimate-nutrition",
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
        const response = await fetch(
          "http://localhost:3000/api/estimate-nutrition",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dishName }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch nutrition data");
        }

        const data = await response.json();
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
          // Re-trigger the effect
          navigate(`/results/${encodeURIComponent(dishName || "")}`);
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
            Nutrition per katori
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <NutritionCard
            title="Calories"
            value={nutrition.nutrition_per_katori.calories}
            unit="kcal"
            color="#E74C3C"
            icon="🔥"
          />
          <NutritionCard
            title="Protein"
            value={nutrition.nutrition_per_katori.protein}
            unit="g"
            color="#2ECC71"
            icon="🥩"
          />
          <NutritionCard
            title="Carbs"
            value={nutrition.nutrition_per_katori.carbs}
            unit="g"
            color="#F9A826"
            icon="🌾"
          />
          <NutritionCard
            title="Fat"
            value={nutrition.nutrition_per_katori.fat}
            unit="g"
            color="#E67E22"
            icon="🧈"
          />
          <NutritionCard
            title="Fiber"
            value={nutrition.nutrition_per_katori.fiber}
            unit="g"
            color="#8E44AD"
            icon="🥦"
          />
        </div>

        <NutritionChart data={nutrition.nutrition_per_katori} />

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
      </div>

      {showDebug && (
        <DebugPanel requestData={requestData} responseData={nutrition} />
      )}
    </div>
  );
};

export default ResultsPage;
