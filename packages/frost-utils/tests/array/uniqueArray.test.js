import test from 'ava';
import { uniqueArrayElements } from '../../src/index';

test('Should return the correct results', t => {
    const arr = [1, 1, 2, 2, 3, 3];
    const unique = uniqueArrayElements(arr);
    t.true(unique.length === 3);
});
