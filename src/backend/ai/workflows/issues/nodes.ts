import { ChatOpenAI } from "@langchain/openai";
import { Command, END, type GraphNode } from "@langchain/langgraph";
import type { IssueClassificationType } from "./schema";
import { ClassificationSchema } from "./schema";
import { getIssue, updateIssue } from "../../../db/sql/issues";
import { getChroma } from "../../../db/chroma";
import { IssueStatus } from "../../../controllers/issues/types";
import chalk from "chalk";
import z from "zod";
import { IssueType } from "../../../controllers/issues/types";

type IssueNode = GraphNode<IssueClassificationType>;

const llm = new ChatOpenAI({
  model: "gpt-5-nano",
  apiKey: process.env.OPENAI_API_KEY,
});

// Core Nodes
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
          "You are a customer support triage specialist. Classify the following issue. Set isBogus to true if the issue is spam, gibberish, or abusive content.",
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
    console.log(
      chalk.yellow(
        "[updateIssueFromClassification] No classification found, skipping update",
      ),
    );
    return new Command({ goto: END });
  }

  try {
    console.log(
      chalk.blue(
        `[updateIssueFromClassification] Updating issue ${state.issueId}`,
      ),
    );

    updateIssue(state.issueId, {
      type: classification.type,
      priority: classification.urgency,
      subject: classification.summary,
      description: classification.description,
    });

    console.log(
      chalk.green(
        `[updateIssueFromClassification] Updated issue ${state.issueId}`,
      ),
    );

    if (classification.type === IssueType.General)
      return new Command({
        goto: "answerGeneralQuetion",
      });

    return new Command({ goto: END });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update issue";
    console.log(
      chalk.red(`[updateIssueFromClassification] Error: ${errorMessage}`),
    );
    return new Command({
      update: { error: errorMessage },
      goto: END,
    });
  }
};

// Specialized Nodes
export const resolveGeneralQuestion: IssueNode = async (state) => {
  const { classification } = state;

  if (classification?.isBogus) {
    console.log(
      chalk.red(
        `[resolveGeneralQuestion] Bogus issue ${state.issueId}, closing`,
      ),
    );
    updateIssue(state.issueId, { status: IssueStatus.Closed });
    return new Command({ goto: END });
  }

  if (!classification?.isQuestion) {
    console.log(
      chalk.yellow(
        `[resolveGeneralQuestion] Not a question, marking issue ${state.issueId} as resolved`,
      ),
    );
    updateIssue(state.issueId, { status: IssueStatus.Resolved });
    return new Command({ goto: END });
  }

  console.log(
    chalk.blue(
      `[resolveGeneralQuestion] Question detected, routing to answerGeneralQuestion`,
    ),
  );
  return new Command({ goto: "answerGeneralQuestion" });
};

export const answerGeneralQuetion: IssueNode = async (state) => {
  try {
    const { summary, intent, description } = state.classification!;

    const structuredLlm = llm.withStructuredOutput(
      z.object({
        queries: z.array(z.string()).length(3),
      }),
    );
    const { queries } = await structuredLlm.invoke([
      {
        role: "system",
        content:
          "You are a search query generator. Given a customer support issue, generate 3 concise search queries to find relevant knowledge base articles. Return them as an array of strings.",
      },
      {
        role: "user",
        content: `Generate 3 search queries for this issue:\nSummary: ${summary}\nIntent: ${intent}\nDescription: ${description}`,
      },
    ]);

    console.log(
      chalk.cyan(
        `[answerGeneralQuestion] Generated queries: ${queries.join(", ")}`,
      ),
    );

    const { generalKb } = await getChroma();
    const results = await generalKb.query({ queryTexts: queries, nResults: 3 });

    const documents = results.documents.flat().filter(Boolean) as string[];
    const docIds = results.ids.flat().filter(Boolean) as string[];
    console.log(
      chalk.green(
        `[answerGeneralQuestion] Found ${documents.length} relevant documents`,
      ),
    );

    const knowledgeBaseContext = documents.join("\n\n---\n\n");
    const structuredLlm2 = llm.withStructuredOutput(
      z.object({
        answer: z.string(),
        kbScore: z.enum(["low", "medium", "high"]),
      }),
    );
    const result = await structuredLlm2.invoke([
      {
        role: "system",
        content:
          "You are a customer support agent. Answer the customer's issue concisely using only the provided knowledge base context. Score how well the knowledge base covered the answer: low, medium, or high. If the context doesn't contain relevant information, say so and score low.",
      },
      {
        role: "user",
        content: `Customer issue: ${summary}\n\nRelevant knowledge base articles:\n${knowledgeBaseContext}`,
      },
    ]);

    console.log(
      chalk.green(
        `[answerGeneralQuestion] Answer: ${result.answer} (kbScore: ${result.kbScore})`,
      ),
    );

    if (result.kbScore === "high") {
      updateIssue(state.issueId, {
        status: IssueStatus.Resolved,
        response: result.answer,
      });
      console.log(chalk.green(`[answerGeneralQuestion] High confidence, auto-resolved`));
    } else {
      updateIssue(state.issueId, {
        status: IssueStatus.AwaitingReview,
        response: result.answer,
      });
      console.log(chalk.yellow(`[answerGeneralQuestion] Low/medium confidence, awaiting review`));
    }

    return new Command({
      update: {
        knowledgebaseRetrieval: {
          answer: result.answer,
          kbScore: result.kbScore,
          docIds,
        },
      },
      goto: END,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to answer question from knowledge base";

    console.log(chalk.red(`[answerGeneralQuestion] Error: ${error}`));
    return new Command({
      update: { error: errorMessage },
      goto: END,
    });
  }
};
