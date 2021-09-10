const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const baseConfig = require('./config.base');
const WebpackBar = require('webpackbar');
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin =
	require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => ({
	entry: baseConfig.paths.entry,

	output: {
		filename: 'hrt-[name].js',
		path: baseConfig.paths.output,
	},

	module: {
		rules: [
			{
				test: /\.(js|jsx|svg|ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve('url-loader'),
				options: {
					limit: 150000,
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},

			{
				test: /\.css$/i,
				use: [
					{
						loader: MiniCSSExtractPlugin.loader,
					},
					{
						loader: 'css-loader',
					},
				],
			},
		],
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'dependencies', // part of the bundle name and
					// can be used in chunks array of HtmlWebpackPlugin
					test: /[\\/]node_modules[\\/]/,
					chunks: 'all',
				},
			},
		},
	},

	plugins: [
		new MiniCSSExtractPlugin({ filename: 'hrt-[name].css' }),
		new CleanWebpackPlugin(),
		new Dotenv(),
		new WebpackBar(),
		new ForkTsCheckerPlugin({
			async: false,
		}),
		new EslintPlugin({
			extensions: ['js', 'jsx', 'ts', 'tsx'],
		}),
		new DependencyExtractionWebpackPlugin({ injectPolyfill: true }),
		env && env.addons === 'bundleanalyzer' && new BundleAnalyzerPlugin(),
	].filter(Boolean),

	resolve: baseConfig.resolver,
});
