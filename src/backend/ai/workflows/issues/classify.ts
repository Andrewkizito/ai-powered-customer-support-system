import { Command, END, type GraphNode } from "@langchain/langgraph";
import type { IssueClassificationType } from "./schema";
import { getIssue } from "../../../db/sql/issues";

export const resolveIssueDetails: GraphNode<IssueClassificationType> = async (
  state,
) => {
  const issue = getIssue(state.issueId);
  if (!issue)
    return new Command({
      goto: END,
    });

  return new Command({
    update: {
      issueDetails: issue,
    },
    goto: END,
  });
};
