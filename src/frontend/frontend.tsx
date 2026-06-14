import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { RootProvider } from "./providers/root.tsx";

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RootProvider>
      <App />
    </RootProvider>
  </StrictMode>
);

(import.meta.hot.data.root ??= createRoot(elem)).render(app);
