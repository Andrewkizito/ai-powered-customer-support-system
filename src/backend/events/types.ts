export enum EventType {
  IssueCreated = "issue_created",
}

export type IssueCreatedPayload = {
  issueId: string;
};

export type EventPayloads = {
  [EventType.IssueCreated]: IssueCreatedPayload;
};
