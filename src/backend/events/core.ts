import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

export const on = emitter.on.bind(emitter);
export const emit = emitter.emit.bind(emitter);

export default emitter;
