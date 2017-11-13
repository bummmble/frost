import { isUndefined } from './types';

const canUseDOM = isUndefined(process.env.NODE_ENV) || !!(
  !isUndefined(window) &&
  window.document &&
  window.createElement
);

export const Environment = {
  canUseDOM,
  canUseWorker: !isUndefined(Worker),
  canUseViewport: canUseDOM && !!window.screen,
};
