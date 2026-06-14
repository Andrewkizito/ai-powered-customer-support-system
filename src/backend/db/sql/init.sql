CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK(type IN ('bug', 'feature_request', 'billing', 'account', 'general')),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  userText TEXT NOT NULL DEFAULT '',
  customerId TEXT NOT NULL REFERENCES customers(id),
  assigneeId TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
