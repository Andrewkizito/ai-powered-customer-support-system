import { Outlet } from "react-router-dom";
import AppSidebar from "./app-sidebar";

export default function CoreLayout() {
  return (
    <div className="w-screen h-screen relative bg-muted">
      <AppSidebar />
      <Outlet />
    </div>
  );
}
