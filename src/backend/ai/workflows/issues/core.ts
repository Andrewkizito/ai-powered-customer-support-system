import { END, START, StateGraph } from "@langchain/langgraph";
import { ClassificationState } from "./schema";
import { resolveIssueDetails, classifyIssue } from "./classify";

export const classificationWorkflow = new StateGraph(ClassificationState)
  .addNode("resolveIssueDetails", resolveIssueDetails)
  .addNode("classifyIssue", classifyIssue)
  .addEdge(START, "resolveIssueDetails")
  .addEdge("resolveIssueDetails", "classifyIssue")
  .addEdge("classifyIssue", END);
