import test from 'ava';
import { objectEvery } from '../../src/index';

test('Returns true if all props pass', t => {
    const obj = {test: 1, foo: 2};
    const every = objectEvery(obj, () => true);
    t.true(every === true);
});;

test('Returns false if not', t => {
    const obj = { test: 1, foo: 2};
    const every = objectEvery(obj, () => false);
    t.true(every === false);
});


