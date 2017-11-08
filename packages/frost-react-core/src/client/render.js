import React from 'react';
import { hydrate } from 'react-dom';

import wrapApp from '../shared/wrapApp';

export default function renderApp(App, internals) {
  hydrate(wrapApp(<App />, internals), document.getElementById('root'));
}
