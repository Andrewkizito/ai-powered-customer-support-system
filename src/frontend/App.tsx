import { Route, Routes } from "react-router-dom";
import SignIn from "./features/ui/SignIn";
import Dashboard from "./features/ui/Dashboard";
import CoreLayout from "./layout/core";
import "./index.css";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route element={<CoreLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
