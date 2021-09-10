import http from './http';

class API {
	uri: string;

	constructor(uri: string) {
		this.uri = `${uri}/`;
	}

	async list(query?: any) {
		return http({
			url: this.uri,
			method: 'get',
			params: query,
		}).then((res) => res.data);
	}

	async get(id: number) {
		return http({
			url: this.uri + id,
			method: 'get',
		}).then((res) => res.data);
	}

	async store(data: any) {
		return http({
			url: this.uri,
			method: 'post',
			data: data,
		}).then((res) => res.data);
	}

	async update(id: number, data: any) {
		return http({
			url: this.uri + id,
			method: 'put',
			data: data,
		}).then((res) => res.data);
	}

	async delete(id: number, params?: any) {
		return http({
			url: this.uri + id,
			method: 'delete',
			params: params,
		}).then((res) => res.data);
	}
}

export default API;
