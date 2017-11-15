import React from 'react';
import { hydrate } from 'react-dom';

import wrapApp from '../common/wrapApp';

export default function renderApp(App, internals) {
    hydrate(wrapApp(<App />, internals), document.getElementById('root'))
}
