import { isObject } from './isObject';
import { isArray } from './isArray';

export function isEmpty(value) {
    if (isArray(value)) {
        return value.length === 0;
    } else if (isObject(value)) {
        if (value) {
            for (const key in value) {
                return false;
            }
        }
        return true;
    } else {
        return !value;
    }
}
