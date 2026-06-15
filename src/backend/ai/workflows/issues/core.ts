import { END, START, StateGraph } from "@langchain/langgraph";
import { ClassificationState } from "./schema";
import {
  resolveIssueDetails,
  classifyIssue,
  updateIssueFromClassification,
  answerGeneralQuetion,
} from "./classify";
import events from "../../../events/core";
import { EventType } from "../../../events/types";

const classificationWorkflow = new StateGraph(ClassificationState)
  // Nodes
  .addNode("resolveIssueDetails", resolveIssueDetails)
  .addNode("classifyIssue", classifyIssue)
  .addNode("answerGeneralQuetion", answerGeneralQuetion)
  .addNode("updateIssueFromClassification", updateIssueFromClassification, {
    ends: ["answerGeneralQuetion", END],
  })
  // Edges
  .addEdge(START, "resolveIssueDetails")
  .addEdge("resolveIssueDetails", "classifyIssue")
  .addEdge("classifyIssue", "updateIssueFromClassification")
  .compile();

events.on(EventType.IssueCreated, async function (payload) {
  try {
    const res = await classificationWorkflow.invoke({
      issueId: payload.issueId,
    });

    console.log(JSON.stringify(res, null, 2));
  } catch (error) {
    console.log(error);
  }
});
