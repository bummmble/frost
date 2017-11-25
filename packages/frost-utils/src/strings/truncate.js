export function truncate(str, length, truncateString) {
  truncateString = truncateString || '...'
  length = ~~length
  return str.length > length
    ? str.slice(0, length) + truncateString
    : str
}
