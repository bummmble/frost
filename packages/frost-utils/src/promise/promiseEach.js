export async function promiseEach(arr, fn) {
  for (const item of arr) {
    await fn(item);
  }
}
