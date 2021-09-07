import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Divider,
	Flex,
	Heading,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import queryString from 'query-string';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import BackToBuilder from '../../components/common/BackToBuilder';
import Header from '../../components/common/Header';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import useCourse from '../../hooks/useCourse';
import { QuizSchema as QuizSchemaOld } from '../../schemas';
import API from '../../utils/api';
import { deepClean, deepMerge } from '../../utils/utils';
import Description from './components/Description';
import Name from './components/Name';
import Questions from './components/question/Questions';
import QuizSettings from './components/QuizSettings';

interface QuizSchema extends QuizSchemaOld {
	duration_hour?: number;
	duration_minute?: number;
}

const EditQuiz: React.FC = () => {
	const { quizId, courseId }: any = useParams();
	const { search } = useLocation();
	const { page } = queryString.parse(search);
	const { draftCourse, publishCourse } = useCourse();
	const methods = useForm();
	const history = useHistory();
	const toast = useToast();
	const quizAPI = new API(urls.quizes);
	const [tabIndex, setTabIndex] = useState<number>(
		page === 'questions' ? 1 : 0
	);

	const tabStyles = {
		fontWeight: 'medium',
		py: '4',
	};

	const tabPanelStyles = {
		p: '0',
	};

	// gets total number of content on section
	const quizQuery = useQuery<QuizSchema>([`quiz${quizId}`, quizId], () =>
		quizAPI.get(quizId)
	);

	const updateQuiz = useMutation(
		(data: QuizSchema) => quizAPI.update(quizId, data),
		{
			onSuccess: (data: QuizSchema) => {
				toast({
					title: __('Quiz Added', 'masteriyo'),
					description: data?.name + __(' is successfully added.', 'masteriyo'),
					isClosable: true,
					status: 'success',
				});
			},
		}
	);

	const onSubmit = (data: QuizSchema, status?: 'draft' | 'publish') => {
		const newData: any = {
			duration: (data?.duration_hour || 0) * 60 + +(data?.duration_minute || 0),
			duration_hour: null,
			duration_minute: null,
		};
		status === 'draft' && draftCourse.mutate(courseId);
		status === 'publish' && publishCourse.mutate(courseId);

		updateQuiz.mutate(deepClean(deepMerge(data, newData)));
	};

	if (quizQuery.isSuccess && quizQuery.data.course_id == courseId) {
		return (
			<Stack direction="column" spacing="8" alignItems="center">
				<Header
					showLinks
					showPreview
					showCourseName
					secondBtn={{
						label: 'Save to Draft',
						action: methods.handleSubmit((data: QuizSchema) =>
							onSubmit(data, 'draft')
						),
						isLoading: draftCourse.isLoading,
					}}
					thirdBtn={{
						label: 'Publish',
						action: methods.handleSubmit((data: QuizSchema) =>
							onSubmit(data, 'publish')
						),
						isLoading: publishCourse.isLoading,
					}}
				/>
				<Container maxW="container.xl">
					<Stack direction="column" spacing="6">
						<BackToBuilder />
						<FormProvider {...methods}>
							<Box bg="white" p="10" shadow="box">
								<Stack direction="column" spacing="8">
									<Flex aling="center" justify="space-between">
										<Heading as="h1" fontSize="x-large">
											{__('Edit Quiz:', 'masteriyo')} {quizQuery?.data?.name}
										</Heading>
									</Flex>

									<Tabs
										index={tabIndex}
										onChange={(index) => setTabIndex(index)}>
										<TabList justifyContent="center" borderBottom="1px">
											<Tab sx={tabStyles}>{__('Info', 'masteriyo')}</Tab>
											<Tab sx={tabStyles}>{__('Questions', 'masteriyo')}</Tab>
											<Tab sx={tabStyles}>{__('Settings', 'masteriyo')}</Tab>
										</TabList>
										<TabPanels>
											<TabPanel sx={tabPanelStyles}></TabPanel>
											<TabPanel sx={tabPanelStyles}>
												<Questions
													courseId={quizQuery?.data?.course_id}
													quizId={quizId}
												/>
											</TabPanel>
											<TabPanel sx={tabPanelStyles}></TabPanel>
										</TabPanels>
									</Tabs>
									<form
										onSubmit={methods.handleSubmit((data: QuizSchema) =>
											onSubmit(data)
										)}>
										<Stack direction="column" spacing="6">
											{tabIndex === 0 && (
												<>
													<Name defaultValue={quizQuery?.data?.name} />
													<Description
														defaultValue={quizQuery?.data?.description}
													/>
												</>
											)}

											{tabIndex === 2 && (
												<QuizSettings quizData={quizQuery?.data} />
											)}

											{tabIndex !== 1 && (
												<>
													<Box py="3">
														<Divider />
													</Box>
													<ButtonGroup>
														<Button
															colorScheme="blue"
															type="submit"
															isLoading={updateQuiz.isLoading}>
															{__('Update', 'masteriyo')}
														</Button>
														<Button
															variant="outline"
															onClick={() =>
																history.push(
																	routes.courses.edit.replace(
																		':courseId',
																		courseId
																	)
																)
															}>
															{__('Cancel', 'masteriyo')}
														</Button>
													</ButtonGroup>
												</>
											)}
										</Stack>
									</form>
								</Stack>
							</Box>
						</FormProvider>
					</Stack>
				</Container>
			</Stack>
		);
	}

	return <FullScreenLoader />;
};

export default EditQuiz;
