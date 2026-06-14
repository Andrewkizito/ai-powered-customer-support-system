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
});

export type Classification = z.infer<typeof ClassificationSchema>;

export const ClassificationState = new StateSchema({
  issueId: z.string(),
  classification: ClassificationSchema.optional(),
  error: z.string().optional(),
  issueDetails: z.custom<IssueWithCustomer>(),
});

export type IssueClassificationType = typeof ClassificationState;
