import React from 'react';
import { Provider } from 'react-redux';

export default function wrapApp(App, internals) {
	let wrapped = App;

	if (internals.store) {
		wrapped = (
			<Provider store={internals.store}>
				{wrapped}
			</Provider>
		);
	}

	return wrapped;
}