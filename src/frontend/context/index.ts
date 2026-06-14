import { configureStore } from "@reduxjs/toolkit";
import issuesReducer from "./issues/reducer.ts";
import customersReducer from "./customers/reducer.ts";

export const store = configureStore({
  reducer: {
    issues: issuesReducer,
    customers: customersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
