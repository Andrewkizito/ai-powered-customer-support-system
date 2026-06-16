export enum EventType {
  IssueCreated = "issue_created",
  IssueUpdated = "issue_updated",
}

export type IssueCreatedPayload = {
  issueId: string;
};

export type IssueUpdatedPayload = {
  issueId: string;
  updatedDetails: Record<string, unknown>;
};

export type EventPayloads = {
  [EventType.IssueCreated]: IssueCreatedPayload;
  [EventType.IssueUpdated]: IssueUpdatedPayload;
};
