import { EventEmitter } from "node:events";
import { EventType, type EventPayloads } from "./types.ts";

const emitter = new EventEmitter();

export function on<E extends EventType>(
  event: E,
  handler: (payload: EventPayloads[E]) => void,
) {
  emitter.on(event, handler);
}

export function emit<E extends EventType>(event: E, payload: EventPayloads[E]) {
  emitter.emit(event, payload);
}

export function initServerEvents(server: Bun.Server<undefined>) {
  on(EventType.IssueUpdated, (payload) => {
    server.publish(EventType.IssueUpdated, JSON.stringify(payload));
  });
}

export default {
  on,
  emit,
};
