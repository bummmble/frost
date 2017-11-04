export default server => {
	/** Handle 404 erros
	 *  Note: If doing isomorphic rendering with something like
	 *  Universal Component it will handle 404 paths, but it is good
	 *  to have this backup for paths that are not handled by the universal
	 *  middleware. 
	 */

	server.use((req, res, next) => {
		res.status(404).send('Sorry, that resource was not found');
	});

	// Handle all other errors
	// Note: All 4 params must be specificed on the cb even if 
	// they remain unused, otherwise this won't be used
	server.use((err, req, res, next) => {
		if (err) {
			console.log(err);
			console.log(err.stack);
		}

		res.status(500).send('Sorry, an unexpected error occurred');
	});
};
