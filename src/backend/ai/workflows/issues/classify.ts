import { ChatOpenAI } from "@langchain/openai";
import { Command, END, type GraphNode } from "@langchain/langgraph";
import type { IssueClassificationType } from "./schema";
import { ClassificationSchema } from "./schema";
import { getIssue } from "../../../db/sql/issues";

type IssueNode = GraphNode<IssueClassificationType>;

const llm = new ChatOpenAI({
  model: "gpt-5-nano",
  temperature: 0,
});

export const resolveIssueDetails: IssueNode = async (state) => {
  const errorCommnd = (error: string) =>
    new Command({
      update: {
        error,
      },
      goto: END,
    });

  try {
    const issue = getIssue(state.issueId);
    if (!issue) return errorCommnd("Issue not found in db");

    return new Command({
      update: {
        issueDetails: issue,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to resolve issue details";
    return errorCommnd(errorMessage);
  }
};

export const classifyIssue: IssueNode = async (state) => {
  try {
    const structuredLlm = llm.withStructuredOutput(ClassificationSchema);
    const classification = await structuredLlm.invoke([
      {
        role: "system",
        content:
          "You are a customer support triage specialist. Classify the following issue.",
      },
      {
        role: "user",
        content: `Classify this customer issue:\n\n${state.issueDetails.userText}`,
      },
    ]);

    return new Command({
      update: {
        classification,
      },
      goto: END,
    });
  } catch (error) {
    return new Command({
      update: {
        error:
          error instanceof Error ? error.message : "Failed to classify issue",
      },
      goto: END,
    });
  }
};
