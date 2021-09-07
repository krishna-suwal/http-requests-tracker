import { Icon, Stack } from '@chakra-ui/react';
import React from 'react';
import { components } from 'react-select';
import {
	FillInTheBlanks,
	ImageMatching,
	MultipleChoice,
	OpenEndedEssay,
	SingleChoice,
	SortableQuestion,
	YesNo,
} from '../assets/icons';

const ReactSelectComponent = () => {
	const renderIcon = (iconName: string) => {
		const iconStyles = {
			fontSize: '1.5rem',
		};
		switch (iconName) {
			case 'FillInTheBlanks':
				return <Icon sx={iconStyles} as={FillInTheBlanks} />;
			case 'ImageMatching':
				return <Icon sx={iconStyles} as={ImageMatching} />;
			case 'MultipleChoice':
				return <Icon sx={iconStyles} as={MultipleChoice} />;
			case 'OpenEndedEssay':
				return <Icon sx={iconStyles} as={OpenEndedEssay} />;
			case 'SingleChoice':
				return <Icon sx={iconStyles} as={SingleChoice} />;
			case 'SortableQuestion':
				return <Icon sx={iconStyles} as={SortableQuestion} />;
			case 'YesNo':
				return <Icon sx={iconStyles} as={YesNo} />;
			default:
				return;
		}
	};

	const SingleValue = (singleValueProps: any) => {
		return (
			<components.SingleValue {...singleValueProps}>
				<Stack direction="row" spacing="2">
					{singleValueProps.data.icon && renderIcon(singleValueProps.data.icon)}
					<span>{singleValueProps.data.label}</span>
				</Stack>
			</components.SingleValue>
		);
	};

	const Option = (optionProps: any) => {
		return (
			<components.Option {...optionProps}>
				<Stack direction="row" spacing="2">
					{optionProps.data.icon && renderIcon(optionProps.data.icon)}
					<span>{optionProps.label}</span>
				</Stack>
			</components.Option>
		);
	};

	return { Option: Option, SingleValue: SingleValue };
};

export default ReactSelectComponent;
