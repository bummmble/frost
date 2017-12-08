import test from 'ava';
import { flattenArray } from '../../src/index';

test('It should return a flattened array', t => {
    const arr = ['a', ['b', 'c'], 'd', {'e': [1, 2]}];
    const flattened = flattenArray(arr);
    t.true(flattened.length === 5);
});
