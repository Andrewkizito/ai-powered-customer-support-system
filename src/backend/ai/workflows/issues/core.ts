import { END, START, StateGraph } from "@langchain/langgraph";
import { ClassificationSchema } from "./schema";
import { resolveIssueDetails } from "./classify";

const classificationWorkflow = new StateGraph(ClassificationSchema)
  .addNode("resolveIssueDetails", resolveIssueDetails)
  .addEdge(START, "resolveIssueDetails")
  .addEdge("resolveIssueDetails", END);
