import { __ } from '@wordpress/i18n';
import { UrlSchemeType } from '../../types';
import { isEmpty } from '../../utils/utils';

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
];

export const getSchemeTypeLabel = (scheme: UrlSchemeType) => {
	let label: any = '';

	if ('predefined' === scheme.type) {
		label = predefinedSchemeTypes.find(
			(item) => item.value === scheme.predefined_type
		)?.label;
	} else {
		label = urlSchemeTypes.find((item) => item.value === scheme.type)?.label;
	}

	if (isEmpty(label)) {
		label = scheme.type;
	}
	return label;
};
