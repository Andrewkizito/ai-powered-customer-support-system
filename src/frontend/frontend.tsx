import { AuthProvider } from "react-oidc-context";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { cognitoAuthConfig } from "./config/auth";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <AuthProvider
        {...cognitoAuthConfig}
        onSigninCallback={() => {
          window.history.replaceState({}, document.title, "/");
        }}
      >
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

(import.meta.hot.data.root ??= createRoot(elem)).render(app);
