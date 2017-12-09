import test from 'ava';
import { shallowEqual } from '../../src/index';

test('Should compare non-equal objects', t => {
    const obj = { a: 'a', b: 'b' };
    const obj2 = { test: 1 };
    const isEqual = shallowEqual(obj, obj2);
    t.true(isEqual === false);
});
