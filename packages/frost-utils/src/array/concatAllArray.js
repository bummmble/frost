export function concatAllArray(arr) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    if (Array.isArray(value)) {
      result.push(value);
    }
  }
  return result;
}
