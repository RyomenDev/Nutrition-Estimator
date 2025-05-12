
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-indian-turmeric/10 py-4 border-b border-indian-turmeric/20">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indian-turmeric flex items-center justify-center">
            <span className="text-white font-bold">N</span>
          </div>
          <h1 className="text-xl font-bold text-indian-brown">
            Nutrition Estimator
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
