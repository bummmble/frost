> A small collection of functional, array utility methods

## Usage

#### flattenArray

```js
// Returns a flattened array that represents the Depth-First Search of the input array

const deep = [1, [2, 3], 4, {'test': [5, 6]}, [[7]], 8];
const flattened = flattenArray(deep);
console.log(flattened);
// outputs [1, 2, 3, 4, {'test': [5, 6]}, 7, 8];
```

#### compactArray

```js
// Returns a new Array containing all the elements of the input
// array except 'null' and 'undefined' values. This adds a bit
// of strong typing over Array.prototype.filter

const input = [1, 2, null, undefined];
const compact = compactArray(input);
console.log(compact);
// Outputs [1, 2]
