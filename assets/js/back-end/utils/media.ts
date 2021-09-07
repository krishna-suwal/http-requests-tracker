import urls from '../constants/urls';
import http from './http';

class MediaAPI {
	uri: string;

	constructor() {
		this.uri = `${urls.wpMedia}/`;
	}

	async get(id: number) {
		return http({
			url: this.uri + id,
			method: 'GET',
		}).then((res) => res.data);
	}

	async store(data: any) {
		return http({
			url: this.uri,
			method: 'POST',
			data: data,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}).then((res) => res.data);
	}

	async delete(id: number) {
		return http({
			url: this.uri + id,
			method: 'DELETE',
			params: {
				force: true,
			},
		}).then((res) => res.data);
	}

	async list() {
		return http({
			url: this.uri,
			method: 'GET',
		}).then((res) => res.data);
	}
}

export default MediaAPI;
