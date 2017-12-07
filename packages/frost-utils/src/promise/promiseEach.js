/* eslint-disable no-restricted-syntax no-await-in-loop import/prefer-default-export */
export async function promiseEach(arr, fn) {
  for (const item of arr) {
    await fn(item);
  }
}
