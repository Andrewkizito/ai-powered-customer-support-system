import { z } from "zod";
import db from "../../db/index.ts";
import { emit } from "../../events/core.ts";
import { EventType } from "../../events/types.ts";

export const CreateIssueSchema = z.object({
  customerId: z.string().min(1),
  userText: z.string().min(1),
});

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;

function createIssue(input: CreateIssueInput) {
  const id = crypto.randomUUID();

  db.run(
    `INSERT INTO issues (id, userText, customerId) VALUES (?, ?, ?)`,
    [id, input.userText, input.customerId],
  );

  return db.query("SELECT * FROM issues WHERE id = ?").get(id) as Record<
    string,
    unknown
  >;
}

export async function handleCreateIssue(req: Request): Promise<Response> {
  const body = await req.json();
  const parsed = CreateIssueSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  const issue = createIssue(parsed.data);
  emit(EventType.IssueCreated, { issueId: issue.id as string });
  return Response.json(issue, { status: 201 });
}
