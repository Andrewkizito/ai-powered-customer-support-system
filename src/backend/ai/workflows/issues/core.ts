import { END, START, StateGraph } from "@langchain/langgraph";
import { ClassificationState } from "./schema";
import {
  resolveIssueDetails,
  classifyIssue,
  updateIssueFromClassification,
  resolveGeneralQuestion,
  answerGeneralQuetion,
} from "./nodes";
import events from "../../../events/core";
import { EventType } from "../../../events/types";

const issueWorkflow = new StateGraph(ClassificationState)
  // Nodes
  .addNode("resolveIssueDetails", resolveIssueDetails)
  .addNode("classifyIssue", classifyIssue)
  .addNode("updateIssueFromClassification", updateIssueFromClassification)
  .addNode("answerGeneralQuetion", answerGeneralQuetion)
  .addNode("resolveGeneralQuestion", resolveGeneralQuestion, {
    ends: ["answerGeneralQuetion", END],
  })
  // Edges
  .addEdge(START, "resolveIssueDetails")
  .addEdge("resolveIssueDetails", "classifyIssue")
  .addEdge("classifyIssue", "updateIssueFromClassification")
  .addEdge("updateIssueFromClassification", "resolveGeneralQuestion")
  .compile();

events.on(EventType.IssueCreated, async function (payload) {
  try {
    const res = await issueWorkflow.invoke({
      issueId: payload.issueId,
    });

    console.log(JSON.stringify(res, null, 2));
  } catch (error) {
    console.log(error);
  }
});
