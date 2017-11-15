const hyphenPattern = /-(.)/g;

export function camelize(str) {
  return str.replace(hyphenPattern, (_, character) => {
    return character.toUpperCase();
  });
}
