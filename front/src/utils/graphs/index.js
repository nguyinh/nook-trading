function min(arr, fn) {
  return Math.min(...arr.map(fn));
}
function max(arr, fn) {
  return Math.max(...arr.map(fn));
}

export function extent(arr, fn) {
  return [min(arr, fn), max(arr, fn)];
}
export function addPadding(arr, lowOffset, highOffset) {
  return [
    lowOffset < 1 ? arr[0] - arr[1] * lowOffset : arr[0] - lowOffset,
    highOffset < 1 ? arr[1] + arr[1] * highOffset : arr[1] + highOffset,
  ];
}
