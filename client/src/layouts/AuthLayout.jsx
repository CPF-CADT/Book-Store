import { Outlet } from "react-router-dom";
import { LoginHeader } from "../components/HeaderFooter";

export function AuthLayout() {
  return (
    <div>
      <LoginHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}