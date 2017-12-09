import test from 'ava';
import { objectIs } from '../../src/index';

test('Should tell when two objects are different', t => {
    const obj1 = { test: 1 };
    const obj2 = { boo: 2 };
    const is = objectIs(obj1, obj2);
    t.true(is === false);
});
