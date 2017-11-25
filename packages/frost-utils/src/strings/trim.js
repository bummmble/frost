import { defaultWhitespace } from './helpers'

export function trim(str, chars) {
  if (String.prototype.trim && !chars) {
    return String.prototype.trim.call(str)
  }

  chars = defaultWhitespace(chars)
  return str.replace(new RegExp(`^${chars}+|${chars}|$`, 'g'), '')
}
