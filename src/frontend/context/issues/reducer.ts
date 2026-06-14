import { createSlice } from "@reduxjs/toolkit";
import type { IssueWithCustomer, PaginationMeta } from "@/../backend/controllers/issues/types.ts";
import { fetchIssues, createIssue } from "./actions.ts";

interface IssuesState {
  issues: IssueWithCustomer[];
  metadata: PaginationMeta | null;
  loading: boolean;
  error: string | null;
}

const initialState: IssuesState = {
  issues: [],
  metadata: null,
  loading: false,
  error: null,
};

const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.issues = action.payload.data;
        state.metadata = action.payload.metadata;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Something went wrong";
      })
      // createIssue.fulfilled — dialog handles refetch
  },
});

export default issuesSlice.reducer;
