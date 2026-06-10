import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { AuthProvider } from "react-oidc-context";
import { store } from "./context";
import { cognitoAuthConfig } from "./authConfig";
import App from "./App";

const elem = document.getElementById("root")!;
(import.meta.hot.data.root ??= createRoot(elem)).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
