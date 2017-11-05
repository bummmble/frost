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
