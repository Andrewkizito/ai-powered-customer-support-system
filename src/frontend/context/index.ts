import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/slice";

const PERSIST_KEY = "redux_root";

function loadState() {
  try {
    const raw =
      typeof window !== "undefined" && window.localStorage.getItem(PERSIST_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: combineReducers({
    auth: authReducer,
  }),
  preloadedState: loadState(),
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    const state = store.getState();
    window.localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
