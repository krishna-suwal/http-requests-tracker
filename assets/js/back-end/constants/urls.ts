const base = '/masteriyo/v1/';
const urls = {
	base: process.env.WORDPRESS_URL + '/wp-json',
	settings: base + 'settings',
	categories: base + 'courses/categories',
};

export default urls;
