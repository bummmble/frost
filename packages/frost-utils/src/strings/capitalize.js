export function capitalize(str, lowercase) {
  const remaining = !lowercase ? str.slice(1) : str.slice(1).toLowerCase()
  return str.charAt(0).toUpperCase() + remaining
}
