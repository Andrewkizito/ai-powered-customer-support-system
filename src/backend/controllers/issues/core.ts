import { z } from "zod";
import db from "../../db/index.ts";
import { IssueType, IssueStatus, IssuePriority } from "./types.ts";

const issueTypes = Object.values(IssueType) as [string, ...string[]];
const issuePriorities = Object.values(IssuePriority) as [string, ...string[]];

export const CreateIssueSchema = z.object({
  customerId: z.string().min(1),
  userText: z.string().min(1),
  type: z.enum(issueTypes).optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
  priority: z.enum(issuePriorities).optional(),
});

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;

export function createIssue(input: CreateIssueInput) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO issues (id, type, status, priority, subject, description, userText, customerId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      input.type ?? IssueType.General,
      IssueStatus.Open,
      input.priority ?? IssuePriority.Medium,
      input.subject ?? "",
      input.description ?? "",
      input.userText,
      input.customerId,
      now,
      now,
    ],
  );

  return db.query("SELECT * FROM issues WHERE id = ?").get(id) as Record<string, unknown>;
}
