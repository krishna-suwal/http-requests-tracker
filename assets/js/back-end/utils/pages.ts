import urls from '../constants/urls';
import http from './http';

class PagesAPI {
	uri: string;

	constructor() {
		this.uri = `${urls.wpPages}`;
	}

	async list() {
		return http({
			url: this.uri,
			method: 'GET',
		}).then((res) => res.data);
	}
}

export default PagesAPI;
