export default function getBrowserLocale(supported) {
	return process.env.TARGET === 'web'
		? getLocale(supported)
		: null
}

function getLocale(supportedLocale) {
	const supported = new Set(supportedLocale);
	const available = new Set();

	// Modern standard
	const languages = navigator.languages;
	if (languages) {
		for (const lang of languages) {
			if (supported.has(lang)) {
				available.add(lang);
			}
		}
	}

	// Microsoft
	const userLanguage = navigator.userLanguage;
	if (userLanguage) {
		const UserLanguage = (() => {
			const split = userLanguage.split('-');
			return `${split[0]}-${split[1].toUpperCase()}`;
		})();

		if (supported.has(UserLanguage)) {
			available.add(UserLanguage);
		}
	}

	// legacy
	const language = navigator.language;
	if (language && supported.has(language)) {
		available.add(language);
	}

	// return first match
	const first = Array.from(available.values())[0];
	return first ? {
		locale: first,
		language: first.split('-')[0],
		region: first.split('-')[1] || first.split('-')[0].toUpperCase()
	} : null
} 