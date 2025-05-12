
import { Button } from "@/components/ui/button";

type ErrorFallbackProps = {
  error: string;
  resetErrorBoundary: () => void;
};

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-red-600 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {error || "We couldn't estimate nutrition for this dish. Please try again or try a different dish."}
      </p>
      <Button
        onClick={resetErrorBoundary}
        className="bg-indian-saffron hover:bg-indian-saffron/90 rounded-xl px-6"
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorFallback;
