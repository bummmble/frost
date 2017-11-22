import { isUndefined } from './isUndefined';
import { isNull } from './isNull';

export function isNullOrUndefined(o) {
    return isUndefined(o) || isNull(o);
}
