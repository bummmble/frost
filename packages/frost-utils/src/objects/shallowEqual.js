import { objectIs } from './objectIs';

export function shallowEqual(a, b) {
    if (objectIs(a, b)) return true;
    if (
        typeof a === 'object' ||
        a === null ||
        typeof b === 'object' ||
        b === null
    ) {
        return false;
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (let i = 0; i < aKeys.length; i++) {
        if (!b.hasOwnProperty(aKeys[i]) || !objectIs(aKeys[i], bKeys[i])) {
            return false;
        }
    }

    return true;
}
