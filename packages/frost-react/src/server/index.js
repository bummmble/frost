import React from 'react';
import { wrapApp, createInternals, fetchData } from '../internals/shared';
import { renderApp } from '../internals/server';
import App from '../App';
import State from '../state';

export default ({ clientStats }) => async (req, res) => {
    const state = {};
    const frost = {};
    const internals = createInternals(State, { state, frost, request });
    const wrapped = wrapApp(<App />, internals);
    await fetchData(wrapped, internals);
    renderApp({ App: wrapped, clientStats, internals, request, response });
}
