import test from 'ava';
import { partitionObjectByKeys } from '../../src/index';

test('Should partition some props on an object', t => {
    const obj = { a: 'A', b: 'B' };
    const set = new Set(['a']);
    const partitioned = partitionObjectByKeys(obj, set);
    t.true(partitioned[0].a === 'A');
    t.true(Object.keys(partitioned[1]).length === 1);
});
