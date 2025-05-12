
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indian-cream to-white">
      <Header />
      <main className="container px-4 py-6 mx-auto max-w-5xl">
        <Outlet />
      </main>
      <footer className="py-4 text-center text-indian-brown/60 text-sm">
        © 2025 Nutrition Estimator
      </footer>
    </div>
  );
};

export default Layout;
