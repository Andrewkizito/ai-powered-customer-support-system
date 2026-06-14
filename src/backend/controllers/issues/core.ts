import { z } from "zod";
import db from "../../db/index.ts";
import { emit } from "../../events/core.ts";
import { EventType } from "../../events/types.ts";

export const CreateIssueSchema = z.object({
  customerId: z.string().min(1),
  userText: z.string().min(1),
});

export type CreateIssueInput = z.infer<typeof CreateIssueSchema>;

export const GetIssuesSchema = z.object({
  status: z.string().optional(),
  customerId: z.string().optional(),
});

export type GetIssuesInput = z.infer<typeof GetIssuesSchema>;

function createIssue(input: CreateIssueInput) {
  const id = crypto.randomUUID();

  db.run(`INSERT INTO issues (id, userText, customerId) VALUES (?, ?, ?)`, [
    id,
    input.userText,
    input.customerId,
  ]);

  return db.query("SELECT * FROM issues WHERE id = ?").get(id) as Record<
    string,
    unknown
  >;
}

function getIssues(filters: GetIssuesInput) {
  let sql = "SELECT * FROM issues";
  const params: string[] = [];
  const conditions: string[] = [];

  if (filters.status) {
    conditions.push("status = ?");
    params.push(filters.status);
  }
  if (filters.customerId) {
    conditions.push("customerId = ?");
    params.push(filters.customerId);
  }
  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY createdAt DESC";

  return db.query(sql).all(...params) as Record<string, unknown>[];
}

export async function handleGetIssues(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const parsed = GetIssuesSchema.safeParse(
      Object.fromEntries(url.searchParams),
    );
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues }, { status: 400 });
    }
    const issues = getIssues(parsed.data);
    return Response.json(issues);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function handleCreateIssue(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const parsed = CreateIssueSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues }, { status: 400 });
    }

    const issue = createIssue(parsed.data);
    emit(EventType.IssueCreated, { issueId: issue.id as string });
    return Response.json(issue, { status: 201 });
  } catch (error) {
    console.error(error);
    if ((error as any)?.code === "SQLITE_CONSTRAINT_FOREIGNKEY") {
      return Response.json({ error: "Customer not found" }, { status: 400 });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
