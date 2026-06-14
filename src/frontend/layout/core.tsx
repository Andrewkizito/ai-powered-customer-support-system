import { Outlet } from "react-router-dom";
import AppSidebar from "./app-sidebar";
import AppHeader from "./app-header";

export default function CoreLayout() {
  return (
    <div className="w-screen h-screen relative bg-muted">
      <AppSidebar />
      <AppHeader />
      <div className="h-screen ml-75 mt-16 p-6">
        <Outlet />
      </div>
    </div>
  );
}
