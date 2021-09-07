import {
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	Input,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
	defaultValue?: string;
}
const SlugInput: React.FC<Props> = (props) => {
	const { defaultValue } = props;
	const {
		register,
		formState: { errors },
	} = useFormContext();

	return (
		<FormControl isInvalid={!!errors?.slug}>
			<FormLabel>{__('Slug', 'masteriyo')}</FormLabel>
			<Input
				defaultValue={defaultValue}
				{...register('slug', {
					required: __('You must provide name for the category', 'masteriyo'),
					validate: (value) =>
						value.includes(' ')
							? __('Spaces are not allowed', 'masteriyo')
							: true,
				})}
			/>
			<FormHelperText>
				{__(
					'The “slug” is the URL-friendly version of the name. It should be all lowercase and contains only letters, numbers, and hyphens.',
					'masteriyo'
				)}
			</FormHelperText>
			<FormErrorMessage>
				{errors?.slug && errors?.slug?.message}
			</FormErrorMessage>
		</FormControl>
	);
};

export default SlugInput;
