import {
	FormControl,
	FormHelperText,
	FormLabel,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Stack,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

interface Props {
	defaultValue?: any;
}
const Price: React.FC<Props> = (props) => {
	const { defaultValue } = props;
	const { control } = useFormContext();

	const watchPrice = useWatch({
		name: 'price',
		defaultValue: defaultValue,
		control,
	});

	return (
		<FormControl>
			<FormLabel>{__('Price', 'masteriyo')}</FormLabel>

			<Stack direction="row" spacing="6">
				<Controller
					name="regular_price"
					defaultValue={defaultValue || 0}
					render={({ field }) => (
						<NumberInput {...field} w="full">
							<NumberInputField borderRadius="sm" shadow="input" />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					)}
				/>
			</Stack>
			{watchPrice == 0 && (
				<FormHelperText>
					{__('Setting price 0 will make your course free', 'masteriyo')}
				</FormHelperText>
			)}
		</FormControl>
	);
};

export default Price;
