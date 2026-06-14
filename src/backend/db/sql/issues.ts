import db from "../index.ts";

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

export function createIssue(input: CreateIssueInput) {
  const id = crypto.randomUUID();

  db.run(`INSERT INTO issues (id, userText, customerId) VALUES (?, ?, ?)`, [
    id,
    input.userText,
    input.customerId,
  ]);

  const row = db.query(`SELECT issues.*, json_object(
    'id', customers.id,
    'name', customers.name,
    'email', customers.email,
    'profilePicture', customers.profilePicture
  ) AS customer
FROM issues JOIN customers ON issues.customerId = customers.id
WHERE issues.id = ?`).get(id) as Record<string, unknown>;

  return {
    ...row,
    customer: JSON.parse(row.customer as string),
  };
}

export function getIssue(id: string) {
  const row = db.query(`SELECT issues.*, json_object(
    'id', customers.id,
    'name', customers.name,
    'email', customers.email,
    'profilePicture', customers.profilePicture
  ) AS customer
FROM issues JOIN customers ON issues.customerId = customers.id
WHERE issues.id = ?`).get(id) as Record<string, unknown> | undefined;

  if (!row) return null;

  return {
    ...row,
    customer: JSON.parse(row.customer as string),
  };
}

export function getIssues(filters: GetIssuesInput) {
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
