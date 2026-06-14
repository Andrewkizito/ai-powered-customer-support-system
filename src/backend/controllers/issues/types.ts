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
  type: string | null;
  status: string;
  priority: string | null;
  subject: string | null;
  description: string | null;
  userText: string;
  customerId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
}

export interface IssueWithCustomer extends Issue {
  customer: Customer;
}

export interface PaginationMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  metadata: PaginationMeta;
}

export type IssueListResponse = PaginatedResponse<IssueWithCustomer>;
