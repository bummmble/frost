export function partitionArray(arr, pred, ctx) {
  const first = [];
  const second = [];
  arr.forEach((el, idx) => {
    if (pred.call(ctx, el, idx, arr)) {
      first.push(el);
    } else {
      second.push(el);
    }
  });
  return [first, second];
}
