import {
	Box,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Icon,
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
	Tooltip,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import { infoIconStyles } from '../../../config/styles';
import { CourseArchiveSettingsMap } from '../../../types';

interface Props {
	courseArchiveData?: CourseArchiveSettingsMap;
}

//@ts-ignore
const imageSizes = window._MASTERIYO_.imageSizes;

const CourseArchiveSettings: React.FC<Props> = (props) => {
	const { courseArchiveData } = props;
	const {
		register,
		formState: { errors },
	} = useFormContext();

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
					<Tab sx={tabStyles}>{__('Display', 'masteriyo')}</Tab>
				</TabList>
				<TabPanels flex="1">
					<TabPanel>
						<Stack direction="column" spacing="8">
							<FormControl>
								<Stack direction="row" spacing="4">
									<FormLabel minW="2xs">
										{__('Show/Hide Search', 'masteriyo')}
										<Tooltip
											label={__(
												'Display search on course archive page',
												'masteriyo'
											)}
											hasArrow
											fontSize="xs">
											<Box as="span" sx={infoIconStyles}>
												<Icon as={BiInfoCircle} />
											</Box>
										</Tooltip>
									</FormLabel>
									<Switch
										{...register('course_archive.display.enable_search')}
										defaultChecked={courseArchiveData?.display?.enable_search}
									/>
								</Stack>
							</FormControl>

							<FormControl
								isInvalid={!!errors?.course_archive?.display?.per_page}>
								<FormLabel minW="2xs">
									{__('Course Per Page', 'masteriyo')}
									<Tooltip
										label={__(
											'Display number of courses per page on course archive',
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
									name="course_archive.display.per_page"
									defaultValue={courseArchiveData?.display?.per_page}
									rules={{ required: 'Course per page is required.' }}
									render={({ field }) => (
										<NumberInput {...field} min={1}>
											<NumberInputField borderRadius="sm" shadow="input" />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
									)}
								/>
								<FormErrorMessage>
									{errors?.course_archive?.display?.per_page &&
										errors?.course_archive?.display?.per_page.message}
								</FormErrorMessage>
							</FormControl>

							<FormControl
								isInvalid={!!errors?.course_archive?.display?.per_row}>
								<FormLabel minW="2xs">
									{__('Course Per Row', 'masteriyo')}
									<Tooltip
										label={__(
											'Display number of courses per row on course archive',
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
									name="course_archive.display.per_row"
									defaultValue={courseArchiveData?.display?.per_row}
									rules={{ required: 'Course per row is required.' }}
									render={({ field }) => (
										<NumberInput {...field} min={1} max={4}>
											<NumberInputField borderRadius="sm" shadow="input" />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
									)}
								/>
								<FormErrorMessage>
									{errors?.course_archive?.display?.per_row &&
										errors?.course_archive?.display?.per_row.message}
								</FormErrorMessage>
							</FormControl>

							<FormControl>
								<FormLabel minW="2xs">
									{__('Thumbnail Size', 'masteriyo')}
									<Tooltip
										label={__('Course thumbnail size', 'masteriyo')}
										hasArrow
										fontSize="xs">
										<Box as="span" sx={infoIconStyles}>
											<Icon as={BiInfoCircle} />
										</Box>
									</Tooltip>
								</FormLabel>
								<Select
									defaultValue={courseArchiveData?.display?.thumbnail_size}
									{...register('course_archive.display.thumbnail_size')}>
									{imageSizes?.map((imageSize: string) => (
										<option value={imageSize} key={imageSize}>
											{imageSize}
										</option>
									))}
								</Select>
							</FormControl>
						</Stack>
					</TabPanel>
				</TabPanels>
			</Stack>
		</Tabs>
	);
};

export default CourseArchiveSettings;
