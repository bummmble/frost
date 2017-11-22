import { isUndefined } from './isUndefined';

export function isIterable(value) {
    if (isUndefined(Symbol)) {
        return false;
    }
    return value[Symbol.iterator];
}
