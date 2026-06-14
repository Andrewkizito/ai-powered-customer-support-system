import { EventEmitter } from "node:events";
import type { EventType, EventPayloads } from "./types.ts";

const emitter = new EventEmitter();

export function on<E extends EventType>(
  event: E,
  handler: (payload: EventPayloads[E]) => void,
) {
  emitter.on(event, handler);
}

export function emit<E extends EventType>(
  event: E,
  payload: EventPayloads[E],
) {
  emitter.emit(event, payload);
}

export default emitter;
