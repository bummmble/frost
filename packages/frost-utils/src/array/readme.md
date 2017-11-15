> A small collection of functional, array utility methods

## Usage

#### flattenArray

Returns a flattened array that represents the Depth-First Search of the input array

```js

const deep = [1, [2, 3], 4, {'test': [5, 6]}, [[7]], 8];
const flattened = flattenArray(deep);
console.log(flattened);
// outputs [1, 2, 3, 4, {'test': [5, 6]}, 7, 8];
```

#### compactArray

Returns a new Array containing all the elements of the input
array except 'null' and 'undefined' values. This adds a bit
of strong typing over Array.prototype.filter

```js

const input = [1, 2, null, undefined];
const compact = compactArray(input);
console.log(compact);
// Outputs [1, 2]
```

#### concatAllArray

Concatenates an array on arrays into a single flat array

```js

const input = [1, 2, [3, 4], [[5]], 6];
const concatted = concatAllArray(input);
console.log(concatted);
// Outputs [1, 2, 3, 4, 5, 6];
```

#### distinctArray

Returns the distinct elements of an iterable. The result is an 
array whose elements are ordered by their occurence


```js

const input = [1, 2, 1, 1, 5, 4];
const distinct = distinctArray(input);
console.log(distinct);
// Outputs [1, 2, 5, 4];
```

#### flatMapArray

Applies a function to every item in an array and concatenates    the result into a new, single, flat array

```js

const input = [1, 2, 3, [4]];
const flatMapped = flatMapArray(input, x => x + 2);
console.log(flatMapped);
// Outputs [3, 4, 5, 6]
```

#### groupArray

Groups all items in the array using the given function. An object will be returned where the keys are the group names, and the values are arrays of all the items in the group

```js
const input = ['test', 'woot'];
const fn = item => 'yay!';
const result = groupArray(input, fn);
console.log(result);
// Outputs { yay: ['test', 'woot']}
```

#### partitionArray

Partitions an array based on a predicate function. All elements satisfying this predicate are returned as part of the first array and all elements that don't are returned as part of the second.

```js

const input = [1, 2, 3, 4, 5];
const partitioned = (input, x <= 3);
console.log(partitioned);
// Outputs [[1, 2, 3], [4, 5]]
```
