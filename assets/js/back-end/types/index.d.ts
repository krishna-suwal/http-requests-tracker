interface UrlSchemeType {
	id: number | string;
	title: string;
	type: string;
	author?: { id: number; display_name: string; avatar_url: string };
}

interface LogType {
	id: number | string;
	title: string;
	description: string;
	type: string;
	user?: { id: number; display_name: string; avatar_url: string };
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
