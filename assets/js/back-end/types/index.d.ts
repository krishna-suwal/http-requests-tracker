interface UrlSchemeType {
	enable: boolean;
	id: number | string;
	title: string;
	type: string;
	author?: { id: number; display_name: string; avatar_url: string };
	url?: string;
	regex?: string;
	predefined_type?: string;
}

interface LogType {
	id: number | string;
	title: string;
	description: string;
	type: string;
	user?: { id: number; display_name: string; avatar_url: string };
	data?: any;
	created_at: string;
}

interface StatsMap {
	basic: {
		types: {
			regex: number;
			absolute: number;
			relative: number;
			'predefined.ajax': number;
		};
		users: {
			id: number;
			display_name: string;
			avatar_url: string;
			count: number;
		}[];
	};
}

export interface StatsSettingsType {
	'stats.allow_stats_on_frontend': boolean;
}

export interface DeveloperSettingsType {
	'developer.template_debug': boolean;
	'developer.debug': boolean;
}

export interface SetttingsMap extends StatsSettingsType, DeveloperSettingsType {
	'url_schemes.list': UrlSchemeType[];
}
