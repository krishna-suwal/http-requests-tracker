const _cache = {};

export const cache = {
	set: (name: string | number, value: any) => {
		_cache[name] = value;
	},
	get: (name: string | number, _default: any = undefined) => {
		return _cache[name] === undefined ? _default : _cache[name];
	},
};
