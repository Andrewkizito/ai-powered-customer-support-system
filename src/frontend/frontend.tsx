import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./context";
import { App } from "./App";

const elem = document.getElementById("root")!;
(import.meta.hot.data.root ??= createRoot(elem)).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
