import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IssueListResponse, IssueWithCustomer } from "@/../backend/controllers/issues/types.ts";

export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (params: { status?: string; customerId?: string; limit?: number; page?: number }) => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    if (params.customerId) searchParams.set("customerId", params.customerId);
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.page) searchParams.set("page", String(params.page));

    const res = await fetch(`/api/issues?${searchParams}`);
    if (!res.ok) throw new Error("Failed to fetch issues");
    return (await res.json()) as IssueListResponse;
  },
);

export const createIssue = createAsyncThunk(
  "issues/createIssue",
  async (input: { customerId: string; userText: string }) => {
    const res = await fetch("/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error("Failed to create issue");
    return (await res.json()) as IssueWithCustomer;
  },
);
