export default function getLocale(req) {
	let locale = req.locale;
	let language = null;
	let region = null;
	let source = null;

	if (locale) {
		language = locale.language;
		region = locale.region;
		source = locale.source;
		locale = `${language}-${region}`;
	} else {
		console.warn('Locale not detected by server');

		locale = process.env.DEFAULT_LOCALE;
		if (locale) {
			source = 'env';
			let split = locale.split('-');
			language = split[0];
			region = split[1];
		} else {
			locale = 'en-US';
			language = 'en';
			region = 'US';
			source = 'default';
		}
	}

	console.log(`Using locale: ${locale} via ${source}`);
	return {
		locale,
		language,
		region
	};
}