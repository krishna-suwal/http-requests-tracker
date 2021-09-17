import { __ } from '@wordpress/i18n';
import { LogType } from '../../types';
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

export const getLogTypeLabel = (log: LogType) => {
	let label: any = logTypeLabels.find((item) => item.value === log.type)?.label;

	if (isEmpty(label)) {
		label = log.type;
	}
	return label;
};
