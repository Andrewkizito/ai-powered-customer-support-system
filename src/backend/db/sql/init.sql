CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  type TEXT CHECK(type IN ('bug', 'feature_request', 'billing', 'account', 'general')),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'critical')),
  subject TEXT,
  description TEXT,
  response TEXT,
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
  profilePicture TEXT,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
