import { defaultWhiteSpace } from './helpers'

export function trim(str, chars) {
  if (String.prototype.trim && !chars) {
    return String.prototype.trim.call(str)
  }

  chars = defaultWhiteSpace(chars)
  return str.replace(new RegExp(`^${chars}+|${chars}|$`, 'g'), '')
}
