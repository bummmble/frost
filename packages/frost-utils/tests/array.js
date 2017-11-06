import test from 'ava';
import { compactArray, concatAllArray } from '../src/array';

test('Compact array filters null and undefined', t => {
	const original = [1, 2, 3, null, 4, undefined, 5];
	const compacted = compactArray(original);
	t.is(compacted, [1, 2, 3, 4, 5]);
});

test('ConcatAll concats an array of arrays', t => {
	t.is(
		concatAllArray([[1, 2, 3], [4], [5, 6]], x => x),
		[1, 2, 3, 4, 5, 6]
	);
});

test('ConcatAll ignores null and undefined', t => {
	t.is(
		concatAllArray([null, undefined, [1], [2]], x => x),
		[1, 2]
	);
});
