export enum IssueType {
  Bug = "bug",
  FeatureRequest = "feature_request",
  Billing = "billing",
  Account = "account",
  General = "general",
}

export enum IssueStatus {
  Open = "open",
  InProgress = "in_progress",
  Resolved = "resolved",
  Closed = "closed",
}

export enum IssuePriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Critical = "critical",
}

export interface Issue {
  id: string;
  type: IssueType;
  status: IssueStatus;
  priority: IssuePriority;
  subject: string;
  description: string;
  userText: string;
  customerId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
}
