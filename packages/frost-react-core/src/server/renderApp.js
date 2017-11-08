import ReactDOM from 'react-dom/server';
import flushChunks from 'webpack-flush-chunks';
import { flushChunkNames } from 'react-universal-component/server';
import { NOT_FOUND } from 'redux-first-router';

import renderHTML from './renderHTML';

export default ({ App, clientStats, internals, req, res }) => {
  const state = internals.store.getState();
  const location = state.location;
  let status = 200;

  if (location.type === NOT_FOUND) {
    status = 404;
  } else if (location.kind === 'redirect') {
    return res.redirect(302, location.pathname);
  }

  let html = '';
  try {
    html = ReactDOM.renderToString(App);
  } catch (err) {
    console.error(`Unable to render react server side. ${err}`);
  }

  const chunkNames = flushChunkNames();
  const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });
  const renderedHTML = renderHTML({
    state,
    html,
    styles: styles.toString(),
    scripts: cssHash + js.toString(),
  });

  res.setHeader('Cache-Control', 'no-cache');
  return res.status(status).send(renderedHTML);
};
