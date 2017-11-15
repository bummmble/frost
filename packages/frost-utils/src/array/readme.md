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
```

#### concatAllArray

```js
// Concatenates an array on arrays into a single flat array

const input = [1, 2, [3, 4], [[5]], 6];
const concatted = concatAllArray(input);
console.log(concatted);
// Outputs [1, 2, 3, 4, 5, 6];
```

#### distinctArray

```js
// Returns the distinct elements of an iterable. The result is an 
// array whose elements are ordered by their occurence

const input = [1, 2, 1, 1, 5, 4];
const distinct = distinctArray(input);
console.log(distinct);
// Outputs [1, 2, 5, 4];
```

#### flatMapArray

```js
// Applies a function to every item in an array and concatenates    // the result into a new, single, flat array

const input = [1, 2, 3, [4]];
const flatMapped = flatMapArray(input, x => x + 2);
console.log(flatMapped);
// Outputs [3, 4, 5, 6]
```
