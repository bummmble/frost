import test from 'ava';
import { objectRemoveEmpty } from '../../src/index';

test('Should remove null and undefined object entries', t => {
    const obj = { test: null, boo: undefined, heart: 1 };
    const removed = objectRemoveEmpty(obj);
    t.true(Object.keys(removed).length === 1);
});
