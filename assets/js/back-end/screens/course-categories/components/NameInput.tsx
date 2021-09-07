import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
	defaultValue?: string;
}
const NameInput: React.FC<Props> = (props) => {
	const { defaultValue } = props;
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<FormControl isInvalid={!!errors?.name}>
			<FormLabel>{__('Name', 'masteriyo')}</FormLabel>
			<Input
				defaultValue={defaultValue}
				placeholder={__('Your Category Name', 'masteriyo')}
				{...register('name', {
					required: __('You must provide name for the category', 'masteriyo'),
				})}
			/>
			<FormErrorMessage>
				{errors?.name && errors?.name?.message}
			</FormErrorMessage>
		</FormControl>
	);
};

export default NameInput;
