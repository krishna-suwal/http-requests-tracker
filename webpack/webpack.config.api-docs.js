const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const outputPath = path.resolve(__dirname, 'api-docs', 'dist');

module.exports = {
	mode: 'development',
	entry: {
		app: path.resolve(__dirname, '..', 'api-docs', 'src', 'index.js'),
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.yaml$/,
				use: [{ loader: 'json-loader' }, { loader: 'yaml-loader' }],
			},
			{
				test: /\.css$/,
				use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: 'api-docs/index.html',
		}),
		new Dotenv(),
	],
	output: {
		filename: '[name].bundle.js',
		path: outputPath,
	},
};
