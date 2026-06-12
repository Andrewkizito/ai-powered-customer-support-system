import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import SignIn from "./features/ui/SignIn";
import Dashboard from "./features/ui/Dashboard";
import CoreLayout from "./layout/core";
import "./index.css";

function RootGate() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.isLoading) return null;

  return <SignIn />;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate]);

  if (auth.isLoading || !auth.isAuthenticated) return null;

  return children;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<RootGate />} />
      <Route
        element={
          <RequireAuth>
            <CoreLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
