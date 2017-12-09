import test from 'ava';
import { objectMap } from '../../src/index';

test('It should map an object', t => {
    const obj = { test: 1, boo: 2 };
    const mapped = objectMap(obj, (value, name) => {
        return value * 2;
    });
    t.true(mapped.test === 2);
});
