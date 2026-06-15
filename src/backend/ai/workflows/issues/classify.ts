import { ChatOpenAI } from "@langchain/openai";
import { Command, END, type GraphNode } from "@langchain/langgraph";
import type { IssueClassificationType } from "./schema";
import { ClassificationSchema } from "./schema";
import { getIssue, updateIssue } from "../../../db/sql/issues";
import chalk from "chalk";

type IssueNode = GraphNode<IssueClassificationType>;

const llm = new ChatOpenAI({
  model: "gpt-5-nano",
  apiKey: process.env.OPENAI_API_KEY,
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
    console.log(
      chalk.blue(`[resolveIssueDetails] Fetching issue: ${state.issueId}`),
    );
    const issue = getIssue(state.issueId);
    if (!issue) {
      console.log(
        chalk.red(`[resolveIssueDetails] Issue not found: ${state.issueId}`),
      );
      return errorCommnd("Issue not found in db");
    }

    console.log(
      chalk.green(
        `[resolveIssueDetails] Resolved issue ${state.issueId} for customer ${issue.customerId}`,
      ),
    );
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
    console.log(chalk.red(`[resolveIssueDetails] Error: ${errorMessage}`));
    return errorCommnd(errorMessage);
  }
};

export const classifyIssue: IssueNode = async (state) => {
  try {
    console.log(
      chalk.cyan(
        `[classifyIssue] Classifying issue ${state.issueId}: "${state.issueDetails.userText.slice(0, 60)}..."`,
      ),
    );
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

    console.log(
      chalk.green(
        `[classifyIssue] Classification result: type=${classification.type}, urgency=${classification.urgency}, intent="${classification.intent}"`,
      ),
    );
    return new Command({
      update: {
        classification,
      },
      goto: END,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to classify issue";
    console.log(chalk.red(`[classifyIssue] Error: ${errorMessage}`));
    return new Command({
      update: {
        error: errorMessage,
      },
      goto: END,
    });
  }
};

export const updateIssueFromClassification: IssueNode = async (state) => {
  const { classification } = state;

  if (!classification) {
    console.log(chalk.yellow("[updateIssueFromClassification] No classification found, skipping update"));
    return new Command({ goto: END });
  }

  try {
    console.log(chalk.blue(`[updateIssueFromClassification] Updating issue ${state.issueId}`));

    updateIssue(state.issueId, {
      type: classification.type,
      priority: classification.urgency,
      subject: classification.summary,
      description: classification.description,
    });

    console.log(chalk.green(`[updateIssueFromClassification] Updated issue ${state.issueId}`));
    return new Command({ goto: END });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update issue";
    console.log(chalk.red(`[updateIssueFromClassification] Error: ${errorMessage}`));
    return new Command({
      update: { error: errorMessage },
      goto: END,
    });
  }
};
