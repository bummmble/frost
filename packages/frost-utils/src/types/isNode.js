import { isFunction } from './isFunction';
import { isObject } from './isObject';
import { isString } from './isString';
import { isNumber } from './isNumber';

export function isNode(obj) {
    const doc = obj ? obj.ownerDocument : document;
    const defaultView = doc.defaultView || window;
    return Boolean(
        obj && (
            isFunction(defaultView.Node)
                ? obj instanceof defaultView.Node
                : isObject(obj)
            && isNumber(obj.nodeType)
            && isString(obj.nodeName)
        )
    );
}
