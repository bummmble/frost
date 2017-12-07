> A small set of Promise utilties

## Usage

### Promisify

```js
promisify(function)
```

Promisify takes a function and wraps its execution in a promise. 

```js
import { remove } from 'fs-extra';

const removePromise = promisify(remove);
removePromise('src/index.js').then(() => {
    console.log('removed!');
});
```

### promiseEach

```js
promiseEach(array, callback)
```

promiseEach takes an array of promises and a callback function to be executed on each promise.

```js

promiseEach([promise1, promise2], promise => promise);
```

### Deferred

```js
new Deferred()
```

The Deferred Promise provides an Promise like API that exposes methods to control the resolution and rejection of a promise.

### promiseMap

```js
new promiseMap(entries)
```

Creates a Map of Asynchronous values that can be gotten or set in any order. Unlike a normal Map() a value for a key can only be set once and a key can either be resolved or rejected
