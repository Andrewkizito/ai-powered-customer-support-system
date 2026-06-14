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
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
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
  const params: (string | number)[] = [];
  const conditions: string[] = [];

  if (filters.status) {
    conditions.push("issues.status = ?");
    params.push(filters.status);
  }
  if (filters.customerId) {
    conditions.push("issues.customerId = ?");
    params.push(filters.customerId);
  }

  const where = conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

  const total = db.query(
    `SELECT COUNT(*) as count FROM issues${where}`,
  ).get(...params) as { count: number };

  const offset = (filters.page - 1) * filters.limit;
  const rows = db.query(`SELECT issues.*, json_object(
    'id', customers.id,
    'name', customers.name,
    'email', customers.email,
    'profilePicture', customers.profilePicture
  ) AS customer
FROM issues JOIN customers ON issues.customerId = customers.id${where}
ORDER BY issues.createdAt DESC LIMIT ? OFFSET ?`).all(...params, filters.limit, offset) as Record<string, unknown>[];

  return {
    data: rows.map((r) => ({
      ...r,
      customer: JSON.parse(r.customer as string),
    })),
    metadata: {
      limit: filters.limit,
      page: filters.page,
      total: total.count,
      totalPages: Math.ceil(total.count / filters.limit),
    },
  };
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
    const result = getIssues(parsed.data);
    return Response.json(result);
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
