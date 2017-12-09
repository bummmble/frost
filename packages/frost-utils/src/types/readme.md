> A small set of type utility methods

## Usage

Most of the type functions are simple and straightforward to use, returning a boolean if the type is correct or not.

### isArray

```js
const arr = [];
if (isArray(arr)) {
    console.log('is Array!');
}
// will log is Array
```

### isBoolean

```js
const bool = true;
if (isBoolean(bool)) {
    console.log('is Boolean!');
}
```

### isFunction

```js
const fn = () => {};
if (isFunction(fn)) {
    console.log('is Function!');
}
```

### isNull

```js
const n = null;
if (isNull(n)) {
    console.log('is Null!');
}
```

### isUndefined

```js
const un = undefined;
if (isUndefined(un)) {
    console.log('is Undefined!');
}
```

### isNullOrUndefined

Will return true is the value is null or undefined

```js
const n = null;
const un = undefined;

if (isNullOrUndefined(n)) {
    // returns true
}
if (isNullOrUndefined(un)) {
    // also returns true
}
```

### isString

```js
const str = 'dadf';
if (isString(str)) {
    console.log('is String!');
}
```

### isNumber

```js
const num = 5;
if (isNumber(num)) {
    console.log('is Number!');
}
```

### isObject

```js
const obj = {};
if (isObject(obj)) {
    console.log('is Object!');
}
```

### isEmpty

Returns true if an object or array is empty (has no keys or entries) and false otherwise

```js
const emptyObj = {};
const emptyArr = [];
const fullArr = [1,2,3];

if (isEmpty(emptyObj)) {
    // returns true
}
if (isEmpty(emptyArr)) {
    // returns true
}
if (isEmpty(fullArr)) {
    // returns false
}
```

### isNode

This is a browser method that will return true if the item is a DOM Node

```js
const node = document.getElementById('test');
if (isNode(node)) {
    console.log('a Node!');
}
```

### isTextNode

This is a browser method that will return true if the item is a text Node

```js
const node = document.createTextNode('text');
if (isTextNode(node)) {
    console.log('text node!');
}
```

### areEqual

Checks if two values are equals. Values can be primitives, arrays, or objets. Returns true if both arguments have the same keys and values;

```js
const obj = { test: 1 };
const copy1 = obj;
const copy2 = obj;
if (areEqual(copy1, copy2)) {
    console.log('equal!');
}
```
