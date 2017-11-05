import { isTextNode, isUndefined } from './types';

export const containsNode = (outer, inner) => {
  if (!outer || !inner) {
    return false;
  } else if (outer === inner) {
    return true;
  } else if (isTextNode(outer)) {
    return false;
  } else if (isTextNode(inner)) {
    return containsNode(outer, inner.parentNode);
  } else if ('contains' in outer) {
    return outer.contains(inner);
  } else if (outer.compareDocumentPosition) {
    return !!(outer.compareDocumentPosition(inner) & 16);
  } else {
    return false;
  }
};

export const getActiveElement = doc => {
  doc = doc || (!isUndefined(document) ? document : undefined);
  if (isUndefined(doc)) {
    return null;
  }

  try {
    return doc.getActiveElement || doc.body;
  } catch (e) {
    return doc.body;
  }
};

export const getElementRect = el => {
  const docEl = el.ownerDocument.documentElement;

  if (!('getBoundingClientRect' in el) || !containsNode(docEl, el)) {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
  }

  const rect = el.getBoundingClientRect();

  return {
    left: Math.round(rect.left) - docEl.clientLeft,
    right: Math.round(rect.right) - docEl.clientLeft,
    top: Math.round(rect.top) - docEl.clientTop,
    bottom: Math.round(rect.bottom) - docEl.clientTop,
  };
};

export const getElementPosition = el => {
  const rect = getElementRect(el);
  return {
    x: rect.left,
    y: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
  };
};
