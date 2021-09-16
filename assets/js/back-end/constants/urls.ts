const base = '/hrt/v1/';
const urls = {
	base: process.env.WORDPRESS_URL + '/wp-json',
	settings: base + 'settings',
	logs: base + 'logs',
	categories: base + 'courses/categories',
};

export default urls;
