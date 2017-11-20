export default class Deferred {
  constructor() {
    this._settled = false;
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  getPromise() {
    return this._promise;
  }

  resolve(value) {
    this._settled = true;
    this._resolve(value);
  }

  reject(reason) {
    this._settled = true;
    this._reject(reason);
  }

  catch(...args) {
    return Promise.prototype.catch.apply(this._promise, ...args);
  }

  then(onFulfill, onReject) {
    return Promise.prototype.then.apply(this._promise, arguments);
  }

  done(onFulfill, onReject) {
    const promise = arguments.length
      ? this._promise.then.apply(this._promise, arguments)
      : this._promise;
    promise.then(undefined, err => {
      setTimeout(() => {
        throw err;
      }, 0);
    });
  }

  isSettled() {
    return this._settled;
  }
}
