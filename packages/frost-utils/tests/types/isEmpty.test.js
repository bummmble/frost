import test from 'ava';
import { isEmpty } from '../../src/index';

test('Should determine when array is empty', t => {
    const arr = [];
    const is = isEmpty(arr);
    t.true(is === true);
});

test('Should determine when object is empty', t => {
    const obj = {};
    const is = isEmpty(obj);
    t.true(is === true);
});

test('Should determine when object has values', t => {
    const obj = { test: 1 };
    const is = isEmpty(obj);
    t.true(is === false);
});
