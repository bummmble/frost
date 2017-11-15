import { Deferred } from './promiseDeferred';

class PromiseMap {
  constructor() {
    this._deferred = {};
  }

  get(key) {
    return getDeferred(this._deferred, key).getPromise();
  }

  resolveKey(key, value) {
    const entry = getDeferred(this, deferred, key);
    entry.resolve(value);
  }

  rejectKey(key, reason) {
    const entry = getDeferred(this._deferred, key);
    entry.reject(reason);
  }
}

function getDeferred(entries, key) {
  if (!entries.hasOwnProperty(key)) {
    entries[key] = new Deferred();
  }
  return entries[key];
}
