
import DishForm from "@/components/DishForm";

const HomePage = () => {
  return (
    <div className="max-w-3xl mx-auto text-center py-6">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indian-brown">
          Nutrition Estimator
        </h1>
        <p className="text-xl text-indian-brown/80 max-w-2xl mx-auto">
          Enter the name of any home-cooked Indian dish to get a smart estimate of its nutrition per katori.
        </p>
      </div>
      
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6 md:p-10 mb-8 animate-slide-in">
        <DishForm />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="bg-white/50 rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-indian-turmeric/20 rounded-full flex items-center justify-center mb-3 mx-auto">
            <span className="text-indian-turmeric text-xl">🍛</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Indian Dishes</h3>
          <p className="text-indian-brown/70">
            Works with hundreds of Indian dishes from different regions
          </p>
        </div>
        
        <div className="bg-white/50 rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-indian-saffron/20 rounded-full flex items-center justify-center mb-3 mx-auto">
            <span className="text-indian-saffron text-xl">⚡</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Fast Analysis</h3>
          <p className="text-indian-brown/70">
            Get nutrition estimates in seconds without measuring ingredients
          </p>
        </div>
        
        <div className="bg-white/50 rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-indian-mint/20 rounded-full flex items-center justify-center mb-3 mx-auto">
            <span className="text-indian-mint text-xl">📊</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Detailed Breakdown</h3>
          <p className="text-indian-brown/70">
            View calories, macros, and assumptions behind each estimate
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
