import { isNode } from './isNode';

export function isTextNode(obj) {
    return isNode(obj) && obj.nodeType == 3;
}
