/**
 * External depedencies
 */
const path = require('path');
const sharp = require('sharp');
const mkdirp = require('make-dir');

/**
 * Internal depedencies
 */
const svgPath = path.resolve(__dirname, '..', 'assets', 'svg', 'logo.svg');
const iconsPath = path.resolve(__dirname, '..', 'assets', 'img');
const targetSizes = [
	{
		width: 144,
		height: 144,
		filename: 'logo.png',
	},
	{
		width: null,
		height: 28,
		absPath: path.resolve(
			__dirname,
			'..',
			'docs-src',
			'static',
			'img',
			'favicon.png'
		),
	},
];

// Build extension icons.
mkdirp(iconsPath).then(generateIcons);

/**
 * Generate extension icons.
 *
 * @since 1.4.0
 */
async function generateIcons() {
	await Promise.all(
		targetSizes.map((size) => {
			sharp(svgPath)
				.png()
				.resize({ width: size.width, height: size.height })
				.toFile(size.absPath ? size.absPath : `${iconsPath}/${size.filename}`);
		})
	);
	console.log('Generated icons...');
}
