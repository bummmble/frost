export function wrap(str, options = {}) {
  const {
    width = 75,
    seperator = '\n',
    cut = false,
    preserveSpaces = false,
    trailingSpaces = false
  } = options

  let result

  if (width <= 0) {
    return str
  } else if (!cut) {
    const words = str.split(' ')
    let currentColumn = 0
    result = ''

    while (words.length > 0) {
      if (words[0].length + currentColumn + 1 > width) {
        if (currentColumn > 0) {
          if (preserveSpaces) {
            result += ' '
            currentColumn++
          } else if (trailingSpaces) {
            while (currentColumn < width) {
              result += ' '
              currentColumn++
            }
          }

          result += seperator
          currentColumn = 0
        }
      }

      if (currentColumn > 0) {
        result += ' '
        currentColumn++
      }

      result += words[0]
      currentColumn += words[0].length
      words.shift()
    }

    if (trailingSpaces) {
      while (currentColumn < width) {
        result += ' '
        currentColumn++
      }
    }

    return result
  } else {
    let index = 0
    result = ''

    while (index < str.length) {
      if (index % width == 0 && index > 0) {
        result += seperator
      }
      result += str.charAt(index)
      index++
    }


    if (trailingSpaces) {
      while (index % width > 0) {
        result += ' '
        index++
      }
    }

    return result
  }
}
