import test from 'ava';
import { groupArray } from '../../src/index';

test('Should handle empty arrays', t => {
    const result = groupArray([], item => 'test');
    t.is(Object.keys(result).length, 0);
});

test('Should handle every item being in one group', t => {
    const items = ['hello', 'world', 'test', 'one'];
    const groupFn = item => 'cat';
    const result = groupArray(items, groupFn);
    t.is(Object.keys(result).length, 1);
    items.forEach(item => {
        t.true(result.cat.includes(item))
    })
})
