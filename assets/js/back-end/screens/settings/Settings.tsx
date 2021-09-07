import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import urls from '../../constants/urls';
import { SetttingsMap } from '../../types';
import API from '../../utils/api';
import { deepClean } from '../../utils/utils';
import AdvancedSettings from './components/AdvancedSettings';
import CourseArchiveSettings from './components/CourseArchiveSettings';
import EmailSetttings from './components/EmailSettings';
import GeneralSettings from './components/GeneralSettings';
import LearningPageSettings from './components/LearningPageSettings';
import PaymentsSettings from './components/PaymentsSettings';
import QuizSettings from './components/QuizSettings';
import SingleCourseSettings from './components/SingleCourseSettings';

const Settings = () => {
	const settingsApi = new API(urls.settings);
	const methods = useForm<SetttingsMap>({
		reValidateMode: 'onChange',
		mode: 'onChange',
	});
	const toast = useToast();
	const queryClient = useQueryClient();

	const tabStyles = {
		fontWeight: 'medium',
		fontSize: 'sm',
		py: '4',
	};

	const tabPanelStyles = {
		px: '0',
		py: 8,
	};

	const settingsQuery = useQuery<SetttingsMap>('settings', () =>
		settingsApi.list()
	);

	const updateSettings = useMutation(
		(data: SetttingsMap) => settingsApi.store(data),
		{
			onSuccess: () => {
				toast({
					title: __('Settings is Updated', 'masteriyo'),
					description: __('You can keep changing settings', 'masteriyo'),
					status: 'success',
					isClosable: true,
				});
				queryClient.invalidateQueries(`settings`);
			},
		}
	);
	const onSubmit = (data: SetttingsMap) => {
		try {
			updateSettings.mutate(deepClean(data));
		} catch (err) {
			console.error(err);
		}
	};

	if (settingsQuery.isSuccess) {
		return (
			<FormProvider {...methods}>
				<Stack direction="column" spacing="8" width="full" alignItems="center">
					<Container maxW="container.xl" pt="5">
						<Box bg="white" p="10" shadow="box">
							<Tabs>
								<TabList justifyContent="center" borderBottom="1px">
									<Tab sx={tabStyles}>{__('General', 'masteriyo')}</Tab>
									<Tab sx={tabStyles}>{__('Course List', 'masteriyo')}</Tab>
									<Tab sx={tabStyles}>{__('Single Course', 'masteriyo')}</Tab>
									<Tab sx={tabStyles}>{__('Learning Page', 'masteriyo')}</Tab>
									<Tab sx={tabStyles}>{__('Payments', 'masteriyo')}</Tab>
									<Tab sx={tabStyles}>{__('Quiz', 'masteriyo')}</Tab>
									<Tab sx={tabStyles}>{__('Emails', 'masteriyo')}</Tab>
									<Tab sx={tabStyles}>{__('Advanced', 'masteriyo')}</Tab>
								</TabList>

								<form onSubmit={methods.handleSubmit(onSubmit)}>
									<TabPanels>
										<TabPanel sx={tabPanelStyles}>
											<GeneralSettings
												generalData={settingsQuery.data?.general}
											/>
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<CourseArchiveSettings
												courseArchiveData={settingsQuery.data?.course_archive}
											/>
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<SingleCourseSettings
												singleCourseData={settingsQuery.data?.single_course}
											/>
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<LearningPageSettings
												learningPageData={settingsQuery.data?.learning_page}
											/>
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<PaymentsSettings
												paymentsData={settingsQuery.data?.payments}
											/>
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<QuizSettings quizData={settingsQuery.data?.quiz} />
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<EmailSetttings emailData={settingsQuery.data?.emails} />
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<AdvancedSettings
												advanceData={settingsQuery.data?.advance}
											/>
										</TabPanel>
									</TabPanels>
									<ButtonGroup>
										<Button
											colorScheme="blue"
											type="submit"
											isLoading={updateSettings.isLoading}>
											{__('Save Settings', 'masteriyo')}
										</Button>
									</ButtonGroup>
								</form>
							</Tabs>
						</Box>
					</Container>
				</Stack>
			</FormProvider>
		);
	}
	return <FullScreenLoader />;
};

export default Settings;
