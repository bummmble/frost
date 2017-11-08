import test from 'ava';
import { compactArray, concatAllArray, flatMapArray, groupArray } from '../src/array';

test('Compact array filters null and undefined', t => {
  const original = [1, 2, 3, null, 4, undefined, 5];
  const compacted = compactArray(original);
  t.is(compacted, [1, 2, 3, 4, 5]);
});

test('ConcatAll concats an array of arrays', t => {
  t.is(concatAllArray([[1, 2, 3], [4], [5, 6]], x => x), [1, 2, 3, 4, 5, 6]);
});

test('ConcatAll ignores null and undefined', t => {
  t.is(concatAllArray([null, undefined, [1], [2]], x => x), [1, 2]);
});

test('Flat map should flatten a deep array', t => {
	t.is(
		flatMapArray([1, 2, 3], x => [x, x + 1]),
		[1, 2, 2, 3, 3, 4]
	);
});

test('Flat map should ignore null and undefined', t => {
	t.is(
		flatMapArray([null, undefined, [1], [2]], x => x),
		[1, 2]
	);
})

test('Group array should handle empty array', t => {
	const result = groupArray([], item => 'test');
	t.is(Object.keys(result).length, 0);
});

test('should handle every item in one group', t => {
	const items = ['test', '1', 'two', 'lol'];
	const fn = item => 'meow';
	const result = groupArray(items, fn);

	t.is(Object.keys(result).length, 0);
	t.is(result.meow, items);
});