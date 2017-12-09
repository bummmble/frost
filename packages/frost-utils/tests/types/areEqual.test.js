import test from 'ava';
import { areEqual } from '../../src/index';

test('Should determine when two items are not equal', t => {
    const obj1 = {a: 'a'};
    const obj2 = [3];
    const is = areEqual(obj1, obj2);
    t.true(is === false);
});

test('Should determine when two items are equal', t => {
    const obj = { a: 'a' };
    const one = obj;
    const two = obj;
    const is = areEqual(one, two);
    t.true(is === true);
});
