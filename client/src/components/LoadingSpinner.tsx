
const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-indian-turmeric/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indian-saffron rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-lg text-indian-brown animate-pulse-soft">
        Estimating nutrition...
      </p>
    </div>
  );
};

export default LoadingSpinner;
