import test from 'ava';
import { objectForEach } from '../../src/index';

test('Should function properly', t => {
    const obj = { test: 1, boo: 2 };
    objectForEach(obj, (value, name) => {
        obj[name] = value * 2;
    });
    t.true(obj.test === 2);
    t.true(obj.boo === 4);
});
