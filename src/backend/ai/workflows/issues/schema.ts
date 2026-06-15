import { StateSchema } from "@langchain/langgraph";
import { z } from "zod";
import {
  IssueType,
  IssuePriority,
  type IssueWithCustomer,
} from "../../../controllers/issues/types.ts";

export const ClassificationSchema = z.object({
  intent: z.string().min(1),
  urgency: z.enum(IssuePriority),
  type: z.enum(IssueType),
  summary: z.string(),
  description: z.string(),
  isQuestion: z.boolean(),
  isBogus: z.boolean(),
});

export type Classification = z.infer<typeof ClassificationSchema>;

export const KnowledgebaseRetrieval = z.object({
  answer: z.string(),
  kbScore: z.enum(["low", "medium", "high"]),
  docIds: z.array(z.string()),
});

export const ClassificationState = new StateSchema({
  issueId: z.string(),
  classification: ClassificationSchema.optional(),
  knowledgebaseRetrieval: KnowledgebaseRetrieval.optional(),
  error: z.string().optional(),
  issueDetails: z.custom<IssueWithCustomer>(),
});

export type IssueClassificationType = typeof ClassificationState;
