import React from 'react';
import { Provider } from 'react-redux';

export default function wrapApp(App, internals) {
    let Wrapped = App;

    if (internals.store) {
        Wrapped = (
            <Provider store={internals.store}>
                {Wrapped}
            </Provider>
        );
    }

    return Wrapped;
}
