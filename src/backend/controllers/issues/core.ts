import { z } from "zod";
import { createIssue, getIssues } from "../../db/sql/issues.ts";
import type { CreateIssueInput, GetIssuesInput } from "../../db/sql/issues.ts";
import { emit } from "../../events/core.ts";
import { EventType } from "../../events/types.ts";

export const CreateIssueSchema = z.object({
  customerId: z.string().min(1),
  userText: z.string().min(1),
});

export type { CreateIssueInput, GetIssuesInput };

export const GetIssuesSchema = z.object({
  status: z.string().optional(),
  customerId: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
  page: z.coerce.number().min(1).default(1),
});

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
