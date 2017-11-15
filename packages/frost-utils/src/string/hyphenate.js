const uppercasePattern = /([A-Z])/g;

export function hyphenate(str) {
    return str.replace(uppercasePattern, '-$1').toLowerCase();
}
