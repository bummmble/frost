export function groupArray(arr, fn) {
  const result = {};
  for (let i = 0; i < arr.length; i++) {
    const res = fn.call(arr, arr[i], i);
    if (!result[res]) {
      result[res] = [];
    }
    result[res].push(arr[i]);
  }
  return result;
}
