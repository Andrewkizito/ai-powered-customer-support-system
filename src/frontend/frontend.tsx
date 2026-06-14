import { Provider } from "react-redux";
import { AuthProvider } from "react-oidc-context";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { cognitoAuthConfig } from "./config/auth";
import { TooltipProvider } from "./components/ui/tooltip";
import { store } from "./context/index.ts";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider
          {...cognitoAuthConfig}
          onSigninCallback={() => {
            window.history.replaceState({}, document.title, "/");
          }}
        >
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);

(import.meta.hot.data.root ??= createRoot(elem)).render(app);
