import test from 'ava';
import { flatMapArray } from '../../src/index';

test('Should flatten an array of arrays', t => {
    const arr = [1, 2, 3];
    const flattened = flatMapArray(arr, x => [x, x + 1]);
    t.true(flattened.length === 6);
});

test('Should ignore null and undefined', t => {
    const arr = [null, undefined, [1], [2]];
    const flattened = flatMapArray(arr, x => x);
    t.true(flattened.length === 2);
});
