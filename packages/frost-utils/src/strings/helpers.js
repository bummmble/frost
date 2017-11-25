/* eslint-disable no-useless-escape */
export function escapeExpression(str) {
  return str.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1')
}

export function defaultWhiteSpace(chars) {
  if (chars == null) {
    return '\\s'
  } else if (chars.source) {
    return chars.source
  } else {
    return `[${escapeExpression(chars)}]`
  }
}
