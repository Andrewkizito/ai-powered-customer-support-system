import { StateSchema } from "@langchain/langgraph";
import { z } from "zod";
import { IssueType, IssuePriority } from "../../../controllers/issues/types.ts";

export const ClassificationSchema = z.object({
  intent: z.string().min(1),
  urgency: z.enum(IssuePriority),
  type: z.enum(IssueType),
});

export type Classification = z.infer<typeof ClassificationSchema>;

export const ClassificationState = new StateSchema({
  issueId: z.string(),
  classification: ClassificationSchema.optional(),
  error: z.string().optional(),
});

export type IssueClassificationType = typeof ClassificationState;
