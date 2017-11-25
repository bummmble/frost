import { capitalize } from './capitalize'
import { underscored } from './underscored'
import { trim } from './trim'

export function humanize(str) {
  const scored = underscored(str)
    .replace(/_id$/, '')
    .replace(/_/g, ' ')

  return capitalize(trim(scored))
}
