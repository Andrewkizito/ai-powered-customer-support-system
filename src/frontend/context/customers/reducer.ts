import { createSlice } from "@reduxjs/toolkit";
import type { Customer } from "@/../backend/controllers/issues/types.ts";
import { fetchCustomers } from "./actions.ts";

interface CustomersState {
  list: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  list: [],
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      });
  },
});

export default customersSlice.reducer;
