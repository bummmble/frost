import test from 'ava';
import { compactArray } from '../../src/index';

test('compact should filter null and undefined', t => {
    const arr = [1, 2, 3, undefined, 4, null, 5, 6];
    const compacted = compactArray(arr);
    t.true(compacted.length === 6)
});
