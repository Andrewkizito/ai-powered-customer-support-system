import db from "./index.ts";
import type {
  IssueWithCustomer,
  IssueListResponse,
} from "../../controllers/issues/types.ts";

export interface CreateIssueInput {
  customerId: string;
  userText: string;
}

export interface GetIssuesInput {
  status?: string;
  customerId?: string;
  limit: number;
  page: number;
}

function parseIssueRow(row: Record<string, unknown>): IssueWithCustomer {
  return {
    ...row,
    customer: JSON.parse(row.customer as string),
  } as unknown as IssueWithCustomer;
}

export function createIssue(input: CreateIssueInput): IssueWithCustomer {
  const id = crypto.randomUUID();

  db.run(`INSERT INTO issues (id, userText, customerId) VALUES (?, ?, ?)`, [
    id,
    input.userText,
    input.customerId,
  ]);

  const row = db
    .query(
      `SELECT issues.*, json_object(
    'id', customers.id,
    'name', customers.name,
    'email', customers.email,
    'profilePicture', customers.profilePicture
  ) AS customer
FROM issues JOIN customers ON issues.customerId = customers.id
WHERE issues.id = ?`,
    )
    .get(id) as Record<string, unknown>;

  return parseIssueRow(row);
}

export function getIssue(id: string): IssueWithCustomer | null {
  const row = db
    .query(
      `SELECT issues.*, json_object(
    'id', customers.id,
    'name', customers.name,
    'email', customers.email,
    'profilePicture', customers.profilePicture
  ) AS customer
FROM issues JOIN customers ON issues.customerId = customers.id
WHERE issues.id = ?`,
    )
    .get(id) as Record<string, unknown> | undefined;

  if (!row) return null;

  return parseIssueRow(row);
}

export function updateIssue(
  id: string,
  data: {
    type?: string;
    priority?: string;
    subject?: string;
    description?: string;
    status?: string;
  },
): void {
  const fields: string[] = [];
  const params: (string | number)[] = [];

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
  }

  if (fields.length === 0) return;

  fields.push("updatedAt = datetime('now')");
  params.push(id);

  db.run(`UPDATE issues SET ${fields.join(", ")} WHERE id = ?`, params);
}

export function getIssues(filters: GetIssuesInput): IssueListResponse {
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

  const where =
    conditions.length > 0 ? " WHERE " + conditions.join(" AND ") : "";

  const total = db
    .query(`SELECT COUNT(*) as count FROM issues${where}`)
    .get(...params) as { count: number };

  const offset = (filters.page - 1) * filters.limit;
  const rows = db
    .query(
      `SELECT issues.*, json_object(
    'id', customers.id,
    'name', customers.name,
    'email', customers.email,
    'profilePicture', customers.profilePicture
  ) AS customer
FROM issues JOIN customers ON issues.customerId = customers.id${where}
ORDER BY issues.createdAt DESC LIMIT ? OFFSET ?`,
    )
    .all(...params, filters.limit, offset) as Record<string, unknown>[];

  return {
    data: rows.map(parseIssueRow),
    metadata: {
      limit: filters.limit,
      page: filters.page,
      total: total.count,
      totalPages: Math.ceil(total.count / filters.limit),
    },
  };
}
