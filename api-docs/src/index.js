import SwaggerUI from 'swagger-ui';
import 'swagger-ui/dist/swagger-ui.css';

const spec = require('./swagger-config.yaml');

/**
 * Load environment variables.
 */
if (spec && Array.isArray(spec.servers)) {
	spec.servers.forEach(function (server) {
		try {
			server.url = server.url.replaceAll(
				'{ENV_WORDPRESS_URL}',
				process.env.WORDPRESS_URL + '/wp-json/hrt/v1'
			);
		} catch (error) {
			console.error(error);
		}
	});
}

const ui = SwaggerUI({ spec, dom_id: '#swagger' });

ui.initOAuth({
	appName: 'Swagger UI Webpack Demo',
	// See https://demo.identityserver.io/ for configuration details.
	clientId: 'implicit',
});
