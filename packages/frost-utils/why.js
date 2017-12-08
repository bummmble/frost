const { concatAllArray } = require('./dist/index.cjs');

const arr = [[1, 2, 3], [4], [5, 6]];
const concatted = concatAllArray(arr, x => x);
console.log(concatted);
