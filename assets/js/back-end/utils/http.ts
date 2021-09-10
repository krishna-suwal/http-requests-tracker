import axios from 'axios';
import urls from '../constants/urls';
import { isProduction } from './helper';

const configProduction = {
	//@ts-ignore
	baseURL: _HRT_.rootApiUrl,
	headers: {
		'Content-Type': 'application/json',
		//@ts-ignore
		'X-WP-Nonce': _HRT_.nonce,
	},
};

const configDevelopment = {
	baseURL: urls.base,
	headers: {
		'Content-Type': 'application/json',
	},
	auth: {
		username: process.env.WORDPRESS_USERNAME || '',
		password: process.env.WORDPRESS_PASSWORD || '',
	},
};

const config = isProduction ? configProduction : configDevelopment;

const http = axios.create(config);

export default http;
