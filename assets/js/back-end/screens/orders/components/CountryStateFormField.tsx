import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Select,
	Skeleton,
	Stack,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useQuery } from 'react-query';
import urls from '../../../constants/urls';
import { StatesSchema } from '../../../schemas';
import API from '../../../utils/api';
import { isEmpty } from '../../../utils/utils';

interface Props {
	defaultCountry?: string;
	defaultState?: string;
}
const StateFormField: React.FC<Props> = (props) => {
	const { defaultCountry, defaultState } = props;
	const countriesAPI = new API(urls.countries);
	const statesAPI = new API(urls.states);
	const countriesQuery = useQuery('countries', () => countriesAPI.list());
	const statesQuery = useQuery('states', () => statesAPI.list());

	const {
		register,
		formState: { errors },
		control,
	} = useFormContext();
	const watchSelectedCountry = useWatch({
		name: 'billing.country',
		defaultValue: defaultCountry,
		control,
	});

	if (countriesQuery?.isSuccess && statesQuery?.isSuccess) {
		const matchCountriesData = statesQuery?.data.filter(
			(statesData: StatesSchema) => statesData.country === watchSelectedCountry
		);

		return (
			<Stack direction="row" spacing="8" py="3">
				{countriesQuery.isLoading ? (
					<Skeleton h="6" w="full" />
				) : (
					<FormControl isInvalid={!errors?.billing?.country}>
						<FormLabel>{__('Country / Region', 'masteriyo')}</FormLabel>
						<Select
							{...register('billing.country')}
							placeholder={__('Select a country', 'masteriyo')}
							defaultValue={defaultCountry}>
							{countriesQuery.data.map(
								(country: { code: string; name: string }) => (
									<option value={country.code} key={country.code}>
										{country.name}
									</option>
								)
							)}
						</Select>
						<FormErrorMessage>
							{errors?.billing?.country && errors?.billing?.country?.message}
						</FormErrorMessage>
					</FormControl>
				)}
				{statesQuery.isLoading ? (
					<Skeleton h="6" w="full" />
				) : (
					<FormControl isInvalid={!errors?.billing?.state}>
						<FormLabel>{__('State / County', 'masteriyo')}</FormLabel>
						<Select {...register('billing.state')} defaultValue={defaultState}>
							{!isEmpty(matchCountriesData) ? (
								matchCountriesData[0].states.map(
									(stateData: { code: string; name: string }) => (
										<option value={stateData.code} key={stateData.code}>
											{stateData.name}
										</option>
									)
								)
							) : (
								<option>{__('No state founds', 'masteriyo')}</option>
							)}
						</Select>
						<FormErrorMessage>
							{errors?.billing?.state && errors?.billing?.state?.message}
						</FormErrorMessage>
					</FormControl>
				)}
			</Stack>
		);
	}
	return <Skeleton h="6" w="full" />;
};

export default StateFormField;
