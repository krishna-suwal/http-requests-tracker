const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

// With JSDoc @type annotations, IDEs can provide config autocompletion
/** @type {import('@docusaurus/types').DocusaurusConfig} */
(
	module.exports = {
		title: 'HTTP Requests Tracker',
		tagline: 'Keep track of any http requests in your WordPress site',
		url: 'https://krishna-suwal.github.io',
		baseUrl: '/http-requests-tracker/',
		onBrokenLinks: 'throw',
		onBrokenMarkdownLinks: 'warn',
		favicon: 'img/favicon.png',
		organizationName: 'krishna-suwal',
		projectName: 'http-requests-tracker',
		trailingSlash: false,

		presets: [
			[
				'@docusaurus/preset-classic',
				/** @type {import('@docusaurus/preset-classic').Options} */
				({
					docs: {
						sidebarPath: require.resolve('./sidebars.js'),
						editUrl:
							'https://github.com/krishna-suwal/http-requests-tracker/edit/master/docs',
					},
					blog: {
						showReadingTime: true,
						editUrl:
							'https://github.com/krishna-suwal/http-requests-tracker/edit/master/docs',
					},
					theme: {
						customCss: require.resolve('./src/css/custom.css'),
					},
				}),
			],
		],

		themeConfig:
			/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
			({
				navbar: {
					title: 'HTTP Requests Tracker',
					logo: {
						alt: 'HTTP Requests Tracker',
						src: 'img/logo.svg',
					},
					hideOnScroll: true,
					items: [
						{
							to: '/getting-started',
							label: 'Getting Started',
							position: 'left',
						},
						{
							type: 'doc',
							docId: 'intro',
							position: 'left',
							label: 'Docs',
						},
						{
							href: 'https://wordpress.org/support/plugin/http-requests-tracker/',
							label: 'Community Support',
							position: 'right',
						},
						{
							href: 'https://github.com/krishna-suwal/http-requests-tracker',
							label: 'GitHub',
							position: 'right',
						},
					],
				},
				footer: {
					copyright: `Copyright © ${new Date().getFullYear()}`,
				},
				prism: {
					theme: lightCodeTheme,
					darkTheme: darkCodeTheme,
				},
			}),
	}
);
