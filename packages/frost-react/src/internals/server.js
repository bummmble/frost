if (!global.fetch) {
    const realFetch = require('node-fetch');
    global.fetch = function fetch(url, options) {
        const normalized = (/^\/\//).test(url)
            ? `https:${url}`
            : url;
        return realFetch.call(this, normalized, options);
    }
    global.Response = realFetch.Response;
    global.Headers = realFetch.Headers;
    global.Request = realFetch.Request;
}

export { default as renderHTML } from './server/renderHTML';
export { default as renderApp } from './server/renderApp';
