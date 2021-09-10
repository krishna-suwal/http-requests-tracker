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
	allow_stats_on_frontend: boolean;
}

export interface DeveloperSettingsType {
	debug: boolean;
	template_debug: boolean;
}

export interface SetttingsMap {
	stats: StatsSettingsType;
	developer: DeveloperSettingsType;
}
