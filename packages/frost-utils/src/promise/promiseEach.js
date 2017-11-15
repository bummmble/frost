export async function each(arr, fn) {
  for (const item of arr) {
    await fn(item);
  }
}
