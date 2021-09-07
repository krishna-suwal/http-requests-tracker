import {
	Collapse,
	FormControl,
	FormErrorMessage,
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
import { QuizSchema as QuizSchemaOld } from '../../../schemas';
import { convertMinutesToHours } from '../../../utils/math';

interface Props {
	quizData?: QuizSchema;
}

interface QuizSchema extends QuizSchemaOld {
	duration_hour?: number;
	duration_minute?: number;
}

const QuizSettings: React.FC<Props> = (props) => {
	const { quizData } = props;
	const {
		formState: { errors },
		setValue,
	} = useFormContext<QuizSchema>();

	const [hours, minutes] = convertMinutesToHours(quizData?.duration || 0);

	const [displayValue, setDisplayValue] = useState(
		quizData?.questions_display_per_page != 0 ? '1' : '0'
	);

	const tabStyles = {
		justifyContent: 'flex-start',
		w: '180px',
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

	return (
		<Tabs orientation="vertical">
			<Stack direction="row" flex="1">
				<TabList sx={tabListStyles}>
					<Tab sx={tabStyles}>{__('General', 'masteriyo')}</Tab>
					<Tab sx={tabStyles}>{__('Display', 'masteriyo')}</Tab>
				</TabList>
				<TabPanels flex="1">
					<TabPanel>
						<Stack direction="column" spacing="6">
							<FormControl isInvalid={!!errors?.full_mark}>
								<FormLabel>{__('Full Mark', 'masteriyo')}</FormLabel>
								<Controller
									name="full_mark"
									defaultValue={quizData?.full_mark || 100}
									rules={{
										required: __(
											'Full Mark is required for the quiz',
											'masteriyo'
										),
									}}
									render={({ field }) => (
										<NumberInput {...field} w="full" min={0}>
											<NumberInputField borderRadius="sm" shadow="input" />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
									)}
								/>
								<FormErrorMessage>
									{errors?.full_mark && errors?.full_mark?.message}
								</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={!!errors?.pass_mark}>
								<FormLabel>{__('Pass Mark', 'masteriyo')}</FormLabel>
								<Controller
									name="pass_mark"
									defaultValue={quizData?.pass_mark || 40}
									rules={{
										required: __(
											'Pass mark is required for the quiz',
											'masteriyo'
										),
									}}
									render={({ field }) => (
										<NumberInput {...field} w="full" min={0}>
											<NumberInputField borderRadius="sm" shadow="input" />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
									)}
								/>
								<FormErrorMessage>
									{errors?.pass_mark && errors?.pass_mark?.message}
								</FormErrorMessage>
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
													<NumberInput {...field} flex="1" min={0}>
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
											{errors?.duration_hour && errors?.duration_hour?.message}
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
													<NumberInput {...field} flex="1" min={0} max={59}>
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

							<FormControl isInvalid={!!errors?.attempts_allowed}>
								<FormLabel>{__('Attempts Allowed', 'masteriyo')}</FormLabel>

								<Controller
									name="attempts_allowed"
									defaultValue={quizData?.attempts_allowed || 5}
									rules={{
										required: __('Attempts allowed is required', 'masteriyo'),
									}}
									render={({ field }) => (
										<InputGroup>
											<NumberInput
												{...field}
												defaultValue={quizData?.attempts_allowed || 5}
												w="full"
												min={0}>
												<NumberInputField rounded="sm" />
												<NumberInputStepper>
													<NumberIncrementStepper />
													<NumberDecrementStepper />
												</NumberInputStepper>
											</NumberInput>
											<InputRightAddon>
												{__('Attempts', 'masteriyo')}
											</InputRightAddon>
										</InputGroup>
									)}
								/>
								<FormErrorMessage>
									{errors?.attempts_allowed &&
										errors?.attempts_allowed?.message}
								</FormErrorMessage>
							</FormControl>
						</Stack>
					</TabPanel>
					<TabPanel>
						<Stack direction="column" spacing="6">
							<FormControl>
								<FormLabel>
									{__('Questions Display Per Page', 'masteriyo')}
								</FormLabel>
								<RadioGroup onChange={setDisplayValue} value={displayValue}>
									<Stack direction="column" spacing="4">
										<Stack direction="row" spacing="6" align="flex-start">
											<Controller
												name="questions_display_per_page"
												render={({ field }) => (
													<>
														<Radio
															{...field}
															value="0"
															onChange={(e: any) =>
																setValue(
																	'questions_display_per_page',
																	e.target.value
																)
															}>
															{__('From Global Settings', 'masteriyo')}
														</Radio>
													</>
												)}
											/>

											<Radio value="1">
												{__('Set Individually', 'masteriyo')}
											</Radio>
										</Stack>
										<Collapse
											in={displayValue != '0' ? true : false}
											animateOpacity>
											<FormControl
												isInvalid={!!errors?.questions_display_per_page}>
												<Controller
													name="questions_display_per_page"
													defaultValue={
														quizData?.questions_display_per_page || 5
													}
													rules={{
														required: __(
															'Question display per page is required',
															'masteriyo'
														),
													}}
													render={({ field }) => (
														<NumberInput
															{...field}
															defaultValue={
																quizData?.questions_display_per_page || 5
															}
															w="full"
															min={1}>
															<NumberInputField rounded="sm" />
															<NumberInputStepper>
																<NumberIncrementStepper />
																<NumberDecrementStepper />
															</NumberInputStepper>
														</NumberInput>
													)}
												/>
												<FormErrorMessage>
													{errors?.questions_display_per_page &&
														errors?.questions_display_per_page?.message}
												</FormErrorMessage>
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
	);
};

export default QuizSettings;
