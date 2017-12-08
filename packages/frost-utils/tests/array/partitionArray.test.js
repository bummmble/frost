import test from 'ava';
import { partitionArray } from '../../src/index';

test('Partitions based on a function', t => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const partitioned = partitionArray(arr, x => x > 5);
    t.true(partitioned[0].length === 4);
    t.true(partitioned[1].length === 5);
});
