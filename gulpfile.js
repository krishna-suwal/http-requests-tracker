'use strict';

require('dotenv').config();
const fs = require('fs');
const rename = require('gulp-rename');
const pkg = JSON.parse(fs.readFileSync('./package.json'));
const { dest, series, src, parallel } = require('gulp');
const { exec } = require('child_process');
const zip = require('gulp-zip');
const imagemin = require('gulp-imagemin');

if (!process.env.WORDPRESS_URL && process.env.DEVELOPMENT) {
	console.error('Please set WORDPRESS_URL on your environment variable');
	process.exit(1);
}

const fileList = {
	wordpressOrg: {
		src: '.wordpress-org/**/*',
		dest: 'build/.wordpress-org',
	},
	includes: {
		src: 'includes/**/*',
		dest: 'build/includes',
	},
	assets: {
		src: ['assets/**/*', '!assets/js/back-end/**/*', '!assets/scss/**/*'],
		dest: 'build/assets',
	},
	templates: {
		src: 'templates/**/*',
		dest: 'build/templates',
	},
	i18n: {
		src: 'i18n/**/*',
		dest: 'build/i18n',
	},
	bootstrap: {
		src: 'bootstrap/**/*',
		dest: 'build/bootstrap',
	},
	composer: {
		src: ['composer.json', 'composer.lock'],
		dest: 'build',
	},
	npm: {
		src: ['package.json', 'package.lock'],
		dest: 'build',
	},
	other: {
		src: ['http-requests-tracker.php', 'readme.txt'],
		dest: 'build',
	},
};

// paths for the automation
const paths = {
	backendJS: {
		src: ['assets/js/build/*.js', '!assets/js/build/*.min.js'],
		dest: 'assets/js/build',
	},

	images: {
		src: ['assets/img/*.png', 'assets/img/*.jpg'],
		dest: 'assets/img',
	},

	php: {
		src: 'templates/**/*.php',
	},
};

function removePreviousMinifiedAssets() {
	return exec('find assets/ -name "*.min.*" -type f -delete');
}

function renameBackendAssets() {
	return src(paths.backendJS.src)
		.pipe(rename({ suffix: `.${pkg.version}.min` }))
		.pipe(dest(paths.backendJS.dest));
}

function optimizeImages() {
	return src(paths.images.src).pipe(imagemin()).pipe(dest(paths.images.dest));
}

function removeBuild() {
	return exec('rm -rf build');
}

function removeRelease() {
	return exec('rm -rf release');
}

const copyToBuild = [
	() => src(fileList.wordpressOrg.src).pipe(dest(fileList.wordpressOrg.dest)),
	() => src(fileList.includes.src).pipe(dest(fileList.includes.dest)),
	() => src(fileList.assets.src).pipe(dest(fileList.assets.dest)),
	() => src(fileList.templates.src).pipe(dest(fileList.templates.dest)),
	() => src(fileList.i18n.src).pipe(dest(fileList.i18n.dest)),
	() => src(fileList.bootstrap.src).pipe(dest(fileList.bootstrap.dest)),
	() => src(fileList.composer.src).pipe(dest(fileList.composer.dest)),
	() => src(fileList.other.src).pipe(dest(fileList.other.dest)),
];

function runComposerInBuild() {
	return exec('cd build && composer install --no-dev --optimize-autoloader');
}

function compressBuildWithoutVersion() {
	return src('build/**/*')
		.pipe(zip(`${pkg.name}.zip`))
		.pipe(dest('release'));
}

function compressBuildWithVersion() {
	return src('build/**/*')
		.pipe(zip(`${pkg.name}-${pkg.version}.zip`))
		.pipe(dest('release'));
}

const compileAssets = series(removePreviousMinifiedAssets, optimizeImages);
const build = series(removeBuild, compileAssets, renameBackendAssets);
const release = series(
	removeRelease,
	build,
	copyToBuild,
	runComposerInBuild,
	parallel(compressBuildWithVersion, compressBuildWithoutVersion)
);

exports.clean = parallel(removeBuild, removeRelease);
exports.optimizeImages = optimizeImages;
exports.build = build;
exports.release = release;
