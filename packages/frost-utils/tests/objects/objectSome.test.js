import test from 'ava';
import { objectSome } from '../../src/index';

test('should return false if no props pass', t => {
    const obj = { test: 1, bar: 2 };
    const some = objectSome(obj, () => false);
    t.true(some === false);
});

test('Should return true if all props pass', t => {
    const obj = { test: 1, bar: 2 };
    const some = objectSome(obj, () => true);
    t.true(some === true);
});
