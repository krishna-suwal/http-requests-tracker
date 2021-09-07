import {
	Box,
	Collapse,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Icon,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Stack,
	Switch,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Textarea,
	Tooltip,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import { useQuery } from 'react-query';
import FullScreenLoader from '../../../components/layout/FullScreenLoader';
import { infoIconStyles } from '../../../config/styles';
import urls from '../../../constants/urls';
import {
	CountriesSchema,
	CurrenciesSchema,
	StatesSchema,
} from '../../../schemas';
import { PaymentsSettingsMap } from '../../../types';
import API from '../../../utils/api';
import { hasNumber, isEmpty } from '../../../utils/utils';

interface Props {
	paymentsData?: PaymentsSettingsMap;
}

const PaymentsSettings: React.FC<Props> = (props) => {
	const { paymentsData } = props;

	const countriesAPI = new API(urls.countries);
	const currenciesAPI = new API(urls.currencies);
	const statesAPI = new API(urls.states);
	const countriesQuery = useQuery('countries', () => countriesAPI.list());
	const currenciesQuery = useQuery('currencies', () => currenciesAPI.list());
	const statesQuery = useQuery('states', () => statesAPI.list());

	const {
		register,
		control,
		formState: { errors },
	} = useFormContext();

	const watchSelectedCountry = useWatch({
		name: 'payments.store.country',
		defaultValue: paymentsData?.store.country,
		control,
	});

	const showPayPalOptions = useWatch({
		name: 'payments.paypal.enable',
		defaultValue: paymentsData?.paypal?.enable,
		control,
	});

	const showPayPalSandBoxOptions = useWatch({
		name: 'payments.paypal.sandbox',
		defaultValue: paymentsData?.paypal?.sandbox,
		control,
	});

	const showOfflineOptions = useWatch({
		name: 'payments.offline.enable',
		defaultValue: paymentsData?.offline?.enable,
		control,
	});

	const tabStyles = {
		justifyContent: 'flex-start',
		w: '160px',
		borderLeft: 0,
		borderRight: '2px solid',
		borderRightColor: 'transparent',
		marginLeft: 0,
		marginRight: '-2px',
		pl: 0,
		fontSize: 'sm',
	};

	const tabListStyles = {
		borderLeft: 0,
		borderRight: '2px solid',
		borderRightColor: 'gray.200',
	};

	if (
		countriesQuery?.isSuccess &&
		currenciesQuery?.isSuccess &&
		statesQuery?.isSuccess
	) {
		const matchCountriesData = statesQuery?.data.filter(
			(statesData: StatesSchema) => statesData.country === watchSelectedCountry
		);

		return (
			<Tabs orientation="vertical">
				<Stack direction="row" flex="1">
					<TabList sx={tabListStyles}>
						<Tab sx={tabStyles}>{__('Store', 'masteriyo')}</Tab>
						<Tab sx={tabStyles}>{__('Currency', 'masteriyo')}</Tab>
						<Tab sx={tabStyles}>{__('Standard Paypal', 'masteriyo')}</Tab>
						<Tab sx={tabStyles}>{__('Offline Payment', 'masteriyo')}</Tab>
					</TabList>
					<TabPanels flex="1">
						<TabPanel>
							<Stack direction="column" spacing="6">
								<Stack direction="row" spacing="8">
									<FormControl>
										<FormLabel>
											{__('Country', 'masteriyo')}
											<Tooltip
												label={__('Country where you live', 'masteriyo')}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>

										<Select
											{...register('payments.store.country')}
											defaultValue={paymentsData?.store?.country}>
											{countriesQuery?.data.map((country: CountriesSchema) => (
												<option value={country.code} key={country.code}>
													{country.name}
												</option>
											))}
										</Select>
									</FormControl>
									<FormControl>
										<FormLabel>
											{__('State', 'masteriyo')}
											<Tooltip
												label={__(
													'Your state where you are residing',
													'masteriyo'
												)}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>

										<Select
											{...register('payments.store.state')}
											defaultValue={paymentsData?.store?.state}>
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
									</FormControl>
								</Stack>
								<Stack direction="row" spacing="8">
									<FormControl>
										<FormLabel>
											{__('City', 'masteriyo')}
											<Tooltip
												label={__(
													'Your city where you are residing',
													'masteriyo'
												)}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>

										<Input
											type="text"
											{...register('payments.store.city')}
											defaultValue={paymentsData?.store?.city}
										/>
									</FormControl>
									<FormControl>
										<FormLabel>
											{__('Adress Line 1', 'masteriyo')}
											<Tooltip
												label={__('Your street address')}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>
										<Input
											type="text"
											{...register('payments.store.address_line1')}
											defaultValue={paymentsData?.store?.address_line1}
										/>
									</FormControl>
								</Stack>
								<FormControl>
									<FormLabel>
										{__('Adress Line 2', 'masteriyo')}
										<Tooltip
											label={__('Your street address 2')}
											hasArrow
											fontSize="xs">
											<Box as="span" sx={infoIconStyles}>
												<Icon as={BiInfoCircle} />
											</Box>
										</Tooltip>
									</FormLabel>
									<Input
										type="text"
										{...register('payments.store.address_line2')}
										defaultValue={paymentsData?.store?.address_line2}
									/>
								</FormControl>
							</Stack>
						</TabPanel>
						<TabPanel>
							<Stack direction="column" spacing="6">
								<Stack direction="row" spacing="8">
									<FormControl>
										<FormLabel minW="xs">
											{__('Currency', 'masteriyo')}
											<Tooltip
												label={__('Select default currency', 'masteriyo')}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>
										<Select
											{...register('payments.currency.currency')}
											defaultValue={paymentsData?.currency?.currency}>
											{currenciesQuery?.data.map(
												(currency: CurrenciesSchema) => (
													<option value={currency.code} key={currency.code}>
														{currency.name} ({currency.symbol})
													</option>
												)
											)}
										</Select>
									</FormControl>
									<FormControl>
										<FormLabel minW="xs">
											{__('Currency Position', 'masteriyo')}
											<Tooltip
												label={__(
													'Specifies where the currency symbol will appear',
													'masteriyo'
												)}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>
										<Select
											{...register('payments.currency.currency_position')}
											defaultValue={paymentsData?.currency?.currency_position}>
											<option value="left">{__('Left', 'masteriyo')}</option>
											<option value="right">{__('Right', 'masteriyo')}</option>
											<option value="left_space">
												{__('Left Space', 'masteriyo')}
											</option>
											<option value="right_space">
												{__('Right Space', 'masteriyo')}
											</option>
										</Select>
									</FormControl>
								</Stack>
								<Stack direction="row" spacing="8">
									<FormControl
										isInvalid={
											!!errors?.payments?.currency?.thousand_separator
										}>
										<FormLabel minW="xs">
											{__('Thousand Separator', 'masteriyo')}
											<Tooltip
												label={__(
													"It can't be a number and same as decimal separator",
													'masteriyo'
												)}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>
										<Input
											type="text"
											{...register('payments.currency.thousand_separator', {
												maxLength: {
													value: 1,
													message:
														'Thousand separator should be 1 character only.',
												},
												required: 'Thousand separator is required.',
												validate: (value) =>
													hasNumber(value) ||
													"Thousand separator can't be a number",
											})}
											defaultValue={paymentsData?.currency?.thousand_separator}
										/>
										<FormErrorMessage>
											{errors?.payments?.currency?.thousand_separator &&
												errors?.payments?.currency?.thousand_separator?.message}
										</FormErrorMessage>
									</FormControl>
									<FormControl
										isInvalid={!!errors?.payments?.currency?.decimal_separator}>
										<FormLabel minW="xs">
											{__('Decimal Separator', 'masteriyo')}
											<Tooltip
												label={__(
													"It can't be a number and same as thousand separator",
													'masteriyo'
												)}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>
										<Input
											type="text"
											{...register('payments.currency.decimal_separator', {
												required: 'Decimal separator is required.',
												maxLength: {
													value: 1,
													message:
														'Decimal separator should be 1 character only.',
												},
												validate: (value) =>
													hasNumber(value) ||
													"Decimal separator can't be a number",
											})}
											defaultValue={paymentsData?.currency?.decimal_separator}
										/>
										<FormErrorMessage>
											{errors?.payments?.currency?.decimal_separator &&
												errors?.payments?.currency?.decimal_separator.message}
										</FormErrorMessage>
									</FormControl>
								</Stack>
								<Stack direction="row" spacing="8">
									<FormControl
										isInvalid={
											!!errors?.payments?.currency?.number_of_decimals
										}>
										<FormLabel minW="xs">
											{__('Number of Decimals', 'masteriyo')}
											<Tooltip
												label={__(
													'Number of digit to show on fractional part. (Max limit is 10)',
													'masteriyo'
												)}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>
										<Controller
											name="payments.currency.number_of_decimals"
											defaultValue={
												paymentsData?.currency?.number_of_decimals || 2
											}
											rules={{
												required: 'Number of decimals is required',
											}}
											render={({ field }) => (
												<NumberInput {...field} w="full" min={0} max={10}>
													<NumberInputField />
													<NumberInputStepper>
														<NumberIncrementStepper />
														<NumberDecrementStepper />
													</NumberInputStepper>
												</NumberInput>
											)}
										/>
										<FormErrorMessage>
											{errors?.payments?.currency?.number_of_decimals &&
												errors?.payments?.currency?.number_of_decimals.message}
										</FormErrorMessage>
									</FormControl>
								</Stack>
							</Stack>
						</TabPanel>
						<TabPanel>
							<Stack direction="column" spacing="6">
								<FormControl>
									<Stack direction="row">
										<FormLabel minW="160px">
											{__('Enable', 'masteriyo')}
											<Tooltip
												label={__(
													'Use standard paypal on checkout',
													'masteriyo'
												)}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>
										<Controller
											name="payments.paypal.enable"
											render={({ field }) => (
												<Switch
													{...field}
													defaultChecked={paymentsData?.paypal?.enable}
												/>
											)}
										/>
									</Stack>
								</FormControl>
								<Collapse in={showPayPalOptions} animateOpacity>
									<Stack direction="column" spacing="6">
										<FormControl>
											<FormLabel minW="160px">
												{__('Title', 'masteriyo')}
											</FormLabel>
											<Input
												type="text"
												{...register('payments.paypal.title')}
												defaultValue={paymentsData?.paypal?.title}
											/>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Description', 'masteriyo')}
											</FormLabel>
											<Textarea
												{...register('payments.paypal.description')}
												defaultValue={paymentsData?.paypal?.description}
											/>
										</FormControl>

										<FormControl>
											<Stack direction="row">
												<FormLabel minW="160px">
													{__('Ipn Email Notification', 'masteriyo')}
													<Tooltip
														label={__(
															'Get instant email notification after payment',
															'masteriyo'
														)}
														hasArrow
														fontSize="xs">
														<Box as="span" sx={infoIconStyles}>
															<Icon as={BiInfoCircle} />
														</Box>
													</Tooltip>
												</FormLabel>
												<Controller
													name="payments.paypal.ipn_email_notifications"
													render={({ field }) => (
														<Switch
															{...field}
															defaultChecked={
																paymentsData?.paypal?.ipn_email_notifications
															}
														/>
													)}
												/>
											</Stack>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Email', 'masteriyo')}
											</FormLabel>
											<Input
												type="email"
												{...register('payments.paypal.email')}
												defaultValue={paymentsData?.paypal?.email}
											/>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Reciever Email', 'masteriyo')}
											</FormLabel>
											<Input
												type="email"
												{...register('payments.paypal.receiver_email')}
												defaultValue={paymentsData?.paypal?.receiver_email}
											/>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Indentity Token', 'masteriyo')}
											</FormLabel>
											<Input
												type="text"
												{...register('payments.paypal.identity_token')}
												defaultValue={paymentsData?.paypal?.identity_token}
											/>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Invoice Prefix', 'masteriyo')}
											</FormLabel>
											<Input
												type="text"
												{...register('payments.paypal.invoice_prefix')}
												defaultValue={paymentsData?.paypal?.invoice_prefix}
											/>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Payment Actions', 'masteriyo')}
											</FormLabel>
											<Select
												placeholder={__('Select Payment Action', 'masteriyo')}
												defaultValue={paymentsData?.paypal?.payment_action}
												{...register('payments.paypal.payment_action')}>
												<option value="capture">
													{__('Capture', 'masteriyo')}
												</option>
											</Select>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Image Url', 'masteriyo')}
											</FormLabel>
											<Input
												type="text"
												{...register('payments.paypal.image_url')}
												defaultValue={paymentsData?.paypal?.image_url}
											/>
										</FormControl>

										<FormControl>
											<Stack direction="row">
												<FormLabel minW="160px">
													{__('Debug', 'masteriyo')}
												</FormLabel>
												<Controller
													name="payments.paypal.debug"
													render={({ field }) => (
														<Switch
															{...field}
															defaultChecked={paymentsData?.paypal?.debug}
														/>
													)}
												/>
											</Stack>
										</FormControl>

										<FormControl>
											<Stack direction="row">
												<FormLabel minW="160px">
													{__('Sandbox', 'masteriyo')}
													<Tooltip
														label={__(
															'Standard paypal test environment',
															'masteriyo'
														)}
														hasArrow
														fontSize="xs">
														<Box as="span" sx={infoIconStyles}>
															<Icon as={BiInfoCircle} />
														</Box>
													</Tooltip>
												</FormLabel>
												<Controller
													name="payments.paypal.sandbox"
													render={({ field }) => (
														<Switch
															{...field}
															defaultChecked={paymentsData?.paypal?.sandbox}
														/>
													)}
												/>
											</Stack>
										</FormControl>
										<Collapse in={showPayPalSandBoxOptions}>
											<Stack direction="column" spacing="6">
												<FormControl>
													<FormLabel minW="160px">
														{__('Sandbox API Username', 'masteriyo')}
													</FormLabel>
													<Input
														type="text"
														{...register(
															'payments.paypal.sandbox_api_username'
														)}
														defaultValue={
															paymentsData?.paypal?.sandbox_api_username
														}
													/>
												</FormControl>

												<FormControl>
													<FormLabel minW="160px">
														{__('Sandbox API Password', 'masteriyo')}
													</FormLabel>
													<Input
														type="password"
														{...register(
															'payments.paypal.sandbox_api_password'
														)}
														defaultValue={
															paymentsData?.paypal?.sandbox_api_password
														}
													/>
												</FormControl>

												<FormControl>
													<FormLabel minW="160px">
														{__('Sandbox API Signature', 'masteriyo')}
													</FormLabel>
													<Input
														type="text"
														{...register(
															'payments.paypal.sandbox_api_signature'
														)}
														defaultValue={
															paymentsData?.paypal?.sandbox_api_signature
														}
													/>
												</FormControl>
											</Stack>
										</Collapse>

										<FormControl>
											<FormLabel minW="160px">
												{__('Live API Username', 'masteriyo')}
											</FormLabel>
											<Input
												type="text"
												{...register('payments.paypal.live_api_username')}
												defaultValue={paymentsData?.paypal?.live_api_username}
											/>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Live API Password', 'masteriyo')}
											</FormLabel>
											<Input
												type="password"
												{...register('payments.paypal.live_api_password')}
												defaultValue={paymentsData?.paypal?.live_api_password}
											/>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Live API Signature', 'masteriyo')}
											</FormLabel>
											<Input
												type="text"
												{...register('payments.paypal.live_api_signature')}
												defaultValue={paymentsData?.paypal?.live_api_signature}
											/>
										</FormControl>
									</Stack>
								</Collapse>
							</Stack>
						</TabPanel>
						<TabPanel>
							<Stack direction="column" spacing="6">
								<FormControl>
									<Stack direction="row">
										<FormLabel minW="160px">
											{__('Enable', 'masteriyo')}
											<Tooltip
												label={__(
													'Use offline payment on checkout',
													'masteriyo'
												)}
												hasArrow
												fontSize="xs">
												<Box as="span" sx={infoIconStyles}>
													<Icon as={BiInfoCircle} />
												</Box>
											</Tooltip>
										</FormLabel>
										<Controller
											name="payments.offline.enable"
											render={({ field }) => (
												<Switch
													{...field}
													defaultChecked={paymentsData?.offline?.enable}
												/>
											)}
										/>
									</Stack>
								</FormControl>

								<Collapse in={showOfflineOptions} animateOpacity>
									<Stack direction="column" spacing="6">
										<FormControl>
											<FormLabel minW="160px">
												{__('Title', 'masteriyo')}
											</FormLabel>
											<Input
												type="text"
												{...register('payments.offline.title')}
												defaultValue={paymentsData?.offline?.title}
											/>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Description', 'masteriyo')}
											</FormLabel>
											<Textarea
												{...register('payments.offline.description')}
												defaultValue={paymentsData?.offline?.description}
											/>
										</FormControl>

										<FormControl>
											<FormLabel minW="160px">
												{__('Instructions', 'masteriyo')}
											</FormLabel>
											<Textarea
												{...register('payments.offline.instructions')}
												defaultValue={paymentsData?.offline?.instructions}
											/>
										</FormControl>
									</Stack>
								</Collapse>
							</Stack>
						</TabPanel>
					</TabPanels>
				</Stack>
			</Tabs>
		);
	}

	return <FullScreenLoader />;
};

export default PaymentsSettings;
