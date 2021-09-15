import { __ } from '@wordpress/i18n';

export const urlSchemeTypes = [
	{
		value: 'regex',
		label: __('Regular Expression', 'hrt'),
	},
	{
		value: 'absolute',
		label: __('Absolute URL', 'hrt'),
	},
	{
		value: 'relative',
		label: __('Relative URL', 'hrt'),
	},
	{
		value: 'predefined',
		label: __('Predefined', 'hrt'),
	},
];
export const predefinedSchemeTypes = [
	{
		value: 'ajax',
		label: __('Ajax Requests', 'hrt'),
	},
	{
		value: 'search_query',
		label: __('Search Query', 'hrt'),
	},
	{
		value: 'front_page_query',
		label: __('Front Page Query', 'hrt'),
	},
	{
		value: 'blog_homepage_query',
		label: __('Blog Homepage Query', 'hrt'),
	},
	{
		value: 'feed_query',
		label: __('Feed Query', 'hrt'),
	},
	{
		value: 'heartbeat',
		label: __('Heartbeats', 'hrt'),
	},
];
