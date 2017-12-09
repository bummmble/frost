import test from 'ava';
import { partitionObject } from '../../src/index';

test('Should partition an object', t => {
    const obj = { a: 20, b: 30, c: 40 };
    const partitioned = partitionObject(obj, x => x > 30);
    t.true(partitioned[0].c === 40);
    t.true(Object.keys(partitioned[1]).length === 2);
});
