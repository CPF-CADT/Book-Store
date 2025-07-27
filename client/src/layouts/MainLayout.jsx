import { Outlet } from "react-router-dom";
import { HomeHeader, Footer } from "../components/HeaderFooter";

export function MainLayout() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <HomeHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}