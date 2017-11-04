const hypenPattern = /-(.)/g;

export function camelize(string) {
	return string.replace(hypenPattern, (_, character) => {
		return character.toUpperCase();
	});
}