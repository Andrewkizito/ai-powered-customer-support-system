import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Customer } from "@/../backend/controllers/issues/types.ts";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async () => {
    const res = await fetch("/api/customers");
    if (!res.ok) throw new Error("Failed to fetch customers");
    return (await res.json()) as Customer[];
  },
);
