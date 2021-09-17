const base = '/hrt/v1/';
const urls = {
	base: process.env.WORDPRESS_URL + '/wp-json',
	settings: base + 'settings',
	logs: base + 'logs',
	stats: base + 'stats',
};

export default urls;
