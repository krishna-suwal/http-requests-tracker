import {
	Box,
	Center,
	Collapse,
	FormControl,
	FormErrorMessage,
	FormHelperText,
	FormLabel,
	InputGroup,
	InputRightAddon,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Radio,
	RadioGroup,
	Select,
	Spinner,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from 'react-query';
import urls from '../../../constants/urls';
import { CourseDataMap } from '../../../types/course';
import API from '../../../utils/api';
import { convertMinutesToHours } from '../../../utils/math';
import { decodeEntity } from '../../../utils/utils';

interface Props {
	courseData?: CourseDataMap | any;
}
const CourseSetting: React.FC<Props> = (props) => {
	const { courseData } = props;

	const [enrollDisplayValue, setEnrollDisplayValue] = useState(
		courseData?.enrollment_limit != 0 ? '1' : '0'
	);

	const [pricingDisplayValue, setPricingDisplayValue] = useState(
		courseData?.price_type || 'free'
	);

	const [hours, minutes] = convertMinutesToHours(courseData?.duration || 0);

	const difficultiesAPI = new API(urls.difficulties);
	const {
		register,
		formState: { errors },
		setValue,
	} = useFormContext();

	const diffultiesQuery = useQuery('difficulties', () =>
		difficultiesAPI.list()
	);

	const renderDifficultiesOption = () => {
		try {
			return diffultiesQuery?.data?.map(
				(page: { id: number; name: string }) => (
					<option value={page.id} key={page.id}>
						{page.name}
					</option>
				)
			);
		} catch (error) {
			return;
		}
	};

	const tabStyles = {
		justifyContent: 'flex-start',
		w: '150px',
		borderLeft: 0,
		borderRight: '2px solid',
		borderRightColor: 'transparent',
		marginLeft: 0,
		marginRight: '-2px',
		pl: 0,
		fontSize: 'sm',
		textAlign: 'left',
	};

	const tabListStyles = {
		borderLeft: 0,
		borderRight: '2px solid',
		borderRightColor: 'gray.200',
	};

	//@ts-ignore
	const currencyCode = window._MASTERIYO_.currency.code;

	//@ts-ignore
	const currencySymbol = window._MASTERIYO_.currency.symbol;

	return (
		<Box bg="white" p="10" shadow="box">
			<form>
				<Tabs orientation="vertical">
					<Stack direction="row" flex="1">
						<TabList sx={tabListStyles}>
							<Tab sx={tabStyles}>{__('General', 'masteriyo')}</Tab>
							<Tab sx={tabStyles}>{__('Display', 'masteriyo')}</Tab>
							<Tab sx={tabStyles}>{__('Pricing', 'masteriyo')}</Tab>
						</TabList>
						<TabPanels flex="1">
							<TabPanel>
								{diffultiesQuery?.isLoading ? (
									<Center>
										<Spinner />
									</Center>
								) : (
									<Stack direction="column" spacing="8">
										<FormControl>
											<FormLabel>{__('Difficulty', 'masteriyo')}</FormLabel>
											<Select
												placeholder={__('Choose Course Level', 'masteriyo')}
												defaultValue={courseData?.difficulty?.id}
												{...register('difficulty.id')}>
												{renderDifficultiesOption()}
											</Select>
										</FormControl>
										<Stack direction="column" spacing="0">
											<FormLabel>{__('Duration', 'masteriyo')}</FormLabel>
											<Stack direction="row">
												<FormControl isInvalid={!!errors?.duration_hour}>
													<Controller
														name="duration_hour"
														defaultValue={hours || 0}
														rules={{
															required: __('Hours is required', 'masteriyo'),
															min: 0,
														}}
														render={({ field }) => (
															<InputGroup>
																<NumberInput {...field} w="sm" min={0}>
																	<NumberInputField rounded="sm" />
																	<NumberInputStepper>
																		<NumberIncrementStepper />
																		<NumberDecrementStepper />
																	</NumberInputStepper>
																</NumberInput>
																<InputRightAddon>
																	{__('Hours', 'masteriyo')}
																</InputRightAddon>
															</InputGroup>
														)}
													/>
													<FormErrorMessage>
														{errors?.duration_hour &&
															errors?.duration_hour?.message}
													</FormErrorMessage>
												</FormControl>

												<FormControl isInvalid={!!errors?.duration_minute}>
													<Controller
														name="duration_minute"
														defaultValue={minutes || 0}
														rules={{
															required: __('Minutes is required', 'masteriyo'),
															min: 0,
															max: 59,
														}}
														render={({ field }) => (
															<InputGroup>
																<NumberInput {...field} w="sm" min={0} max={59}>
																	<NumberInputField rounded="sm" />
																	<NumberInputStepper>
																		<NumberIncrementStepper />
																		<NumberDecrementStepper />
																	</NumberInputStepper>
																</NumberInput>
																<InputRightAddon>
																	{__('Minutes', 'masteriyo')}
																</InputRightAddon>
															</InputGroup>
														)}
													/>
													<FormErrorMessage>
														{errors?.duration_minute &&
															errors?.duration_minute?.message}
													</FormErrorMessage>
												</FormControl>
											</Stack>
										</Stack>
										<FormControl>
											<FormLabel>
												{__('Maximum Students', 'masteriyo')}
											</FormLabel>
											<RadioGroup
												onChange={setEnrollDisplayValue}
												value={enrollDisplayValue}>
												<Stack direction="column" spacing="4">
													<Stack direction="row" spacing="8" align="flex-start">
														<Radio
															onChange={(e: any) =>
																setValue('enrollment_limit', e.target.value)
															}
															value="0">
															{__('No limit', 'masteriyo')}
														</Radio>

														<Radio value="1">{__('Limit', 'masteriyo')}</Radio>
													</Stack>
													<Collapse
														in={enrollDisplayValue != '0'}
														animateOpacity>
														<FormControl>
															<FormLabel>
																{__('Number of Students', 'masteriyo')}
															</FormLabel>
															<Controller
																name="enrollment_limit"
																render={({ field }) => (
																	<NumberInput
																		{...field}
																		defaultValue={courseData?.enrollment_limit}>
																		<NumberInputField />
																		<NumberInputStepper>
																			<NumberIncrementStepper />
																			<NumberDecrementStepper />
																		</NumberInputStepper>
																	</NumberInput>
																)}
															/>
														</FormControl>
													</Collapse>
												</Stack>
											</RadioGroup>
										</FormControl>
									</Stack>
								)}
							</TabPanel>

							<TabPanel>
								<Stack direction="column" spacing="8">
									<FormControl>
										<FormLabel>
											{__('Curriculum in Single page', 'masteriyo')}
										</FormLabel>
										<RadioGroup
											defaultValue={
												courseData?.show_curriculum ? 'true' : 'false'
											}
											onChange={(value) => setValue('show_curriculum', value)}>
											<Stack direction="row" spacing="8">
												<Radio value="true">
													{__('Always Visible', 'masteriyo')}
												</Radio>
												<Radio value="false">
													{__('Only Visible to Enrollers', 'masteriyo')}
												</Radio>
											</Stack>
										</RadioGroup>
									</FormControl>
								</Stack>
							</TabPanel>

							<TabPanel>
								<Stack direction="column" spacing="8">
									<FormControl>
										<FormLabel>{__('Pricing Option', 'masteriyo')}</FormLabel>
										<RadioGroup
											onChange={setPricingDisplayValue}
											value={pricingDisplayValue}
											defaultValue={courseData?.price_type}>
											<Stack direction="column" spacing="4">
												<Stack direction="column">
													<Radio value="free">{__('Free', 'masteriyo')}</Radio>
													<Collapse
														in={pricingDisplayValue != 'paid'}
														animateOpacity>
														<RadioGroup
															defaultValue={courseData?.access_mode || 'open'}>
															<Stack direction="column" spacing="3" ml="5">
																<Radio
																	value="open"
																	{...register('access_mode')}>
																	{__(
																		'	Does not need registration',
																		'masteriyo'
																	)}
																</Radio>
																<Radio
																	value="need_registration"
																	{...register('access_mode')}>
																	{__('	Need registration', 'masteriyo')}
																</Radio>
															</Stack>
														</RadioGroup>
													</Collapse>
												</Stack>
												<Radio
													onChange={() => setValue('access_mode', 'one_time')}
													value="paid">
													{__('Paid', 'masteriyo')}
												</Radio>
												<Collapse
													in={pricingDisplayValue != 'free'}
													animateOpacity>
													<FormControl>
														<FormLabel>
															{__('One Time Fee', 'masteriyo')}
														</FormLabel>
														<Controller
															name="regular_price"
															defaultValue={courseData?.regular_price}
															render={({ field }) => (
																<NumberInput {...field} w="full" min={0}>
																	<NumberInputField
																		borderRadius="sm"
																		shadow="input"
																	/>
																	<NumberInputStepper>
																		<NumberIncrementStepper />
																		<NumberDecrementStepper />
																	</NumberInputStepper>
																</NumberInput>
															)}
														/>
														<FormHelperText>
															{currencyCode} ({decodeEntity(currencySymbol)})
														</FormHelperText>
													</FormControl>
												</Collapse>
											</Stack>
										</RadioGroup>
									</FormControl>
								</Stack>
							</TabPanel>
						</TabPanels>
					</Stack>
				</Tabs>
			</form>
		</Box>
	);
};

export default CourseSetting;
