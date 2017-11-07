import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

export default ({ state, html, styles, scripts }) => {
	const frost = state.frost;
	const helmet = Helmet.renderStatic();
	const inlineCode = `APP_STATE=${serialize(state, { isJSON: true })}`;
	const nonceHtml = frost.nonce ? `nonce="${frost.nonce}"` : '';

	return `
		<!doctype html>
		<html ${helmet.htmlAttributes.toString()}>
			<head>
				${helmet.title.toString()}
				${helmet.meta.toString()}
				${helmet.link.toString()}
				${styles}
				${helmet.style.toString()}
			</head>
			<body>
				<div id="root">${html}</div>
				<script ${nonceHtml}>${inlineCode}</script>
				${scripts}
				${helmet.script.toString()}
			</body>
		</html>
	`;
}