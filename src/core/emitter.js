import EventEmitter from 'events';

const emitter = new EventEmitter();

export function onEvent(name, fn) {
    emitter.on(name, fn);
    return emitter;
}

export function emitEvent(name, data) {
    emitter.emit(name, data);
    return emitter;
}
