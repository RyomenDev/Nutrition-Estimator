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
    url: "/api/estimate-nutrition",
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

    // Simulate API call
    const fetchNutrition = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Decide if we want to simulate an error (small chance)
        const simulateError = Math.random() > 0.9;

        if (simulateError) {
          throw new Error(
            "Could not analyze this dish. Please try again or try with a different dish name."
          );
        }

        // Mock response data
        const mockResponse: NutritionResponse = {
          dish: dishName || "Unknown dish",
          type: ["Dry Sabzi", "Wet Curry", "Rice Dish", "Daal"][
            Math.floor(Math.random() * 4)
          ],
          nutrition_per_katori: {
            calories: Math.floor(Math.random() * 200) + 100,
            protein: parseFloat((Math.random() * 10 + 2).toFixed(1)),
            carbs: parseFloat((Math.random() * 25 + 10).toFixed(1)),
            fat: parseFloat((Math.random() * 12 + 3).toFixed(1)),
            fiber: parseFloat((Math.random() * 5 + 1).toFixed(1)),
          },
          assumptions: [
            `Assumed 1 katori = 180g`,
            `Defaulted oil quantity to ${
              Math.floor(Math.random() * 2) + 1
            } tbsp`,
            `Estimated based on typical ${dishName} recipe`,
            `Used standard proportions of ingredients`,
          ],
        };

        setNutrition(mockResponse);
      } catch (err: any) {
        setError(err.message || "Failed to fetch nutrition data");
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
