import { AuthProvider } from "react-oidc-context";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { cognitoAuthConfig } from "./config/auth";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);

(import.meta.hot.data.root ??= createRoot(elem)).render(app);
