import test from 'ava';
import { isArray, isBoolean, isFunction, isNull, isNullOrUndefined, isNumber, isObject, isString, isUndefined } from '../../src/index';

test('Should successfully determine array', t => {
    const arr = [1];
    const is = isArray(arr);
    t.true(is === true);
});

test('Should successfully determine boolean', t => {
    const bool = true;
    const is = isBoolean(bool);
    t.true(is === true);
});

test('Should successfully determine function', t => {
    const fn = () => {};
    const is = isFunction(fn);
    t.true(is === true);
});

test('Should successfully determine null', t => {
    const n = null;
    const is = isNull(n);
    t.true(is === true);
});

test('Should successfully determine undefined', t => {
    const un = undefined;
    const is = isUndefined(un);
    t.true(is === true);
});

test('Should successfully determine null or undefined', t => {
    const n = null;
    const un = undefined;
    const isN = isNullOrUndefined(n);
    const isU = isNullOrUndefined(un);
    t.true(isN === true);
    t.true(isU === true);
});

test('Should successfully determine an object', t => {
    const obj = {};
    const is = isObject(obj);
    t.true(is === true);
});

test('Should successfully determine a string', t => {
    const str = 'fd';
    const is = isString(str);
    t.true(is === true);
});
