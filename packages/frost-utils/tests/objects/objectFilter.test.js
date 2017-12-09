import test from 'ava';
import { objectFilter } from '../../src/index';

test('Should filter an object correctly', t => {
    const obj = { foo: 1, bar: 2 };
    const filtered = objectFilter(obj, (value, key) => key[0] === 'b');
    t.true(Object.keys(filtered).length === 1);
});
