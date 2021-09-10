const path = require('path');

module.exports = {
	paths: {
		entry: {
			backend: path.resolve(process.cwd(), 'assets/js/back-end', 'index.tsx'),
		},
		output: path.resolve(process.cwd(), 'assets/js/build'),
	},

	resolver: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},

	devServer: {
		port: 3000,
	},
};
