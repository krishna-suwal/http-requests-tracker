export const isDevelopment =
	process.env.NODE_ENV === 'development' ? true : false;

export const isProduction =
	process.env.NODE_ENV === 'production' ? true : false;

export const hasNumber = /^\D+$/i;
