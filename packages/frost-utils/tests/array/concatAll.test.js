import test from 'ava';
import { concatAllArray } from '../../src/index';

export function testConcat() {
  test('Should concat an array of arrays', (t) => {
    const arr = [[1, 2, 3], [4], [5, 6]];
    const concatted = concatAllArray(arr, x => x);
    t.true(concatted.length === 6);
  });

  test('Should concat and ignore null and undefined', (t) => {
    const arr = [null, undefined, [1, 2], [3]];
    const compacted = concatAllArray(arr, x => x);
    t.true(compacted.length === 3);
  });
}
