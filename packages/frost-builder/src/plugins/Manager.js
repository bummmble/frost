import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import StatsPlugin from 'stats-webpack-plugin';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';

const basePlugins = (env, webpackTarget, isDev, isProd) => {
	return [
		new webpack.DefinePlugin({
			// These need to be kept separate to allow for usage with
			// libraries like dotenv
			'process.env.NODE_ENV': JSON.stringify(env),
			'process.env.TARGET': JSON.stringify(webpackTarget)
		}),

		// Improves OS Compat
		// See: https://github.com/Urthen/case-sensitive-paths-webpack-plugin
		new CaseSensitivePathsPlugin(),

		isDev ? new webpack.NamedModulesPlugin() : null,
		isDev ? new webpack.NoEmitOnErrorsPlugin() : null,

		isProd ? new webpack.HashedModuleIdsPlugin() : null,
		isProd ? new webpack.optimize.ModuleConcatenationPlugin() : null
	].filter(Boolean)
};

const clientPlugins = (isDev, isProd) => {
	return [
		new ExtractCssChunks({
			filename: isDev ? '[name].css' : '[name]-[contenthash:base62:8].css'
		}),

		isProd ? new StatsPlugin('stats.json') : null,
	].filter(Boolean)
};

const serverPlugins = (isDev, isProd) => {
	return [
		new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
	];
};

export default (env, webpackTarget, isDev, isProd, isServer) => {
	const base = basePlugins(env, webpackTarget, isDev, isProd);
	const plugins = isServer
		? base.concat(...serverPlugins(isDev, isProd))
		: base.concat(...clientPlugins(isDev, isProd))
	return plugins;
}