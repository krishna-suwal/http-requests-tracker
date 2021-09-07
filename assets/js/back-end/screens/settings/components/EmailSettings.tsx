import {
	Box,
	FormControl,
	FormLabel,
	Icon,
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
import { Controller } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import { infoIconStyles } from '../../../config/styles';
import { EmailsSetttingsMap } from '../../../types';

interface Props {
	emailData?: EmailsSetttingsMap;
}

const EmailSetttings: React.FC<Props> = (props) => {
	const { emailData } = props;

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
					<Tab sx={tabStyles}>{__('New Order', 'masteriyo')}</Tab>
					<Tab sx={tabStyles}>{__('Processing Order', 'masteriyo')}</Tab>
					<Tab sx={tabStyles}>{__('Completed Order', 'masteriyo')}</Tab>
					<Tab sx={tabStyles}>{__('Onhold Order', 'masteriyo')}</Tab>
					<Tab sx={tabStyles}>{__('Cancelled Order', 'masteriyo')}</Tab>
					<Tab sx={tabStyles}>{__('Enrolled Course', 'masteriyo')}</Tab>
					<Tab sx={tabStyles}>{__('Completed Course', 'masteriyo')}</Tab>
					<Tab sx={tabStyles}>{__('Become an Instructor', 'masteriyo')}</Tab>
				</TabList>
				<TabPanels flex="1">
					<TabPanel>
						<Stack direction="column" spacing="6">
							<FormControl>
								<Stack direction="row">
									<FormLabel minW="160px">
										{__('Enable', 'masteriyo')}
										<Tooltip
											label={__(
												'Users "new account" emails are sent to the user when a user signs up via checkout or account pages.',
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
										name="emails.general.enable"
										render={({ field }) => (
											<Switch {...field} defaultChecked={false} />
										)}
									/>
								</Stack>
							</FormControl>
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
												'New order emails are sent to students when a new order is received.',
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
										name="emails.new_order.enable"
										render={({ field }) => (
											<Switch
												{...field}
												defaultChecked={emailData?.new_order?.enable}
											/>
										)}
									/>
								</Stack>
							</FormControl>
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
												'This is an order notification sent to students containing order details after payment.',
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
										name="emails.processing_order.enable"
										render={({ field }) => (
											<Switch
												{...field}
												defaultChecked={emailData?.processing_order?.enable}
											/>
										)}
									/>
								</Stack>
							</FormControl>
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
												'Order complete emails are sent to students when their orders are marked completed.',
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
										name="emails.completed_order.enable"
										render={({ field }) => (
											<Switch
												{...field}
												defaultChecked={emailData?.completed_order?.enable}
											/>
										)}
									/>
								</Stack>
							</FormControl>
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
												'This is an order notification sent to students containing order details after an order is placed on-hold.',
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
										name="emails.onhold_order.enable"
										render={({ field }) => (
											<Switch
												{...field}
												defaultChecked={emailData?.onhold_order?.enable}
											/>
										)}
									/>
								</Stack>
							</FormControl>
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
												'Cancelled order emails are sent to students when orders have been marked cancelled (if they were previously processing or on-hold).',
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
										name="emails.cancelled_order.enable"
										render={({ field }) => (
											<Switch
												{...field}
												defaultChecked={emailData?.cancelled_order?.enable}
											/>
										)}
									/>
								</Stack>
							</FormControl>
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
												'Email sent to students when they have enrolled course.',
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
										name="emails.enrolled_course.enable"
										render={({ field }) => (
											<Switch
												{...field}
												defaultChecked={emailData?.enrolled_course?.enable}
											/>
										)}
									/>
								</Stack>
							</FormControl>
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
												'Email sent to students when they marked course is completed.',
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
										name="emails.completed_course.enable"
										render={({ field }) => (
											<Switch
												{...field}
												defaultChecked={emailData?.completed_course?.enable}
											/>
										)}
									/>
								</Stack>
							</FormControl>
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
												'Email sent to user when they requested to become an instructor',
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
										name="emails.become_an_instructor.enable"
										render={({ field }) => (
											<Switch
												{...field}
												defaultChecked={emailData?.become_an_instructor?.enable}
											/>
										)}
									/>
								</Stack>
							</FormControl>
						</Stack>
					</TabPanel>
				</TabPanels>
			</Stack>
		</Tabs>
	);
};

export default EmailSetttings;
