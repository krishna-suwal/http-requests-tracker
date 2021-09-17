import { __ } from '@wordpress/i18n';
import { isEmpty } from '../../utils/utils';

export const logFilterTypes = [
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
		value: 'predefined.ajax',
		label: __('Ajax Requests', 'hrt'),
	},
];

export const logTypeLabels = [
	{
		value: 'regex',
		label: __('RegExp', 'hrt'),
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
		value: 'predefined.ajax',
		label: __('Ajax', 'hrt'),
	},
];

export const getLogTypeLabel = (logType: string) => {
	let label: any = logTypeLabels.find((item) => item.value === logType)?.label;

	if (isEmpty(label)) {
		label = logType;
	}
	return label;
};
