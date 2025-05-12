import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const DishForm = () => {
  const [dishName, setDishName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dishName.trim()) {
      toast.error("Please enter a dish name");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      localStorage.setItem("dishName", dishName); // Save to localStorage
      setIsSubmitting(false);
      navigate("/results");
    }, 600);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto animate-fade-in"
    >
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter dish name (e.g., Palak Paneer)"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          className="dish-input p-1 w-full border-b-2 border-gray-300 focus:border-indigo-600 focus:outline-none transition duration-150"
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        className="w-full py-6 bg-indian-saffron hover:bg-indian-saffron/90 text-white rounded-xl text-lg font-semibold transition-all"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
        ) : (
          "Get Nutrition Estimate"
        )}
      </Button>
    </form>
  );
};

export default DishForm;
