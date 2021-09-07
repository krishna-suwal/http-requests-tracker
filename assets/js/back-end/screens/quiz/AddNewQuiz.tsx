import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	ButtonGroup,
	Container,
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
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import BackToBuilder from '../../components/common/BackToBuilder';
import Header from '../../components/common/Header';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import useCourse from '../../hooks/useCourse';
import { QuizSchema as QuizSchemaOld, SectionSchema } from '../../schemas';
import API from '../../utils/api';
import { deepClean, deepMerge } from '../../utils/utils';
import Description from './components/Description';
import Name from './components/Name';
import QuizSettings from './components/QuizSettings';

interface QuizSchema extends QuizSchemaOld {
	duration_hour?: number;
	duration_minute?: number;
}

const AddNewQuiz: React.FC = () => {
	const { sectionId, courseId }: any = useParams();
	const methods = useForm<QuizSchema>();
	const history = useHistory();
	const toast = useToast();
	const sectionsAPI = new API(urls.sections);
	const quizAPI = new API(urls.quizes);
	const { draftCourse, publishCourse } = useCourse();

	const tabStyles = {
		fontWeight: 'medium',
		py: '4',
	};

	const sectionQuery = useQuery<SectionSchema>(
		[`section${sectionId}`, sectionId],
		() => sectionsAPI.get(sectionId)
	);

	const addQuiz = useMutation((data: QuizSchema) => quizAPI.store(data), {
		onSuccess: (data: QuizSchema) => {
			toast({
				title: __('Quiz Added', 'masteriyo'),
				description: data.name + __(' is successfully added.', 'masteriyo'),
				isClosable: true,
				status: 'success',
			});
			history.push({
				pathname: routes.quiz.edit
					.replace(':quizId', `${data.id}`)
					.replace(':courseId', `${data.course_id}`),
				search: '?page=questions',
			});
		},
	});

	const onSubmit = (data: QuizSchema, status?: 'draft' | 'publish') => {
		const newData = {
			course_id: courseId,
			parent_id: sectionId,

			duration: (data?.duration_hour || 0) * 60 + +(data?.duration_minute || 0),
			duration_hour: null,
			duration_minute: null,
		};

		status === 'draft' && draftCourse.mutate(courseId);
		status === 'publish' && publishCourse.mutate(courseId);

		addQuiz.mutate(deepClean(deepMerge(data, newData)));
	};

	if (sectionQuery.isSuccess && sectionQuery.data.course_id == courseId) {
		return (
			<Stack direction="column" spacing="8" alignItems="center">
				<Header
					showLinks
					showCourseName
					showPreview
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
											{__('Add New Quiz', 'masteriyo')}
										</Heading>
									</Flex>

									<form
										onSubmit={methods.handleSubmit((data: QuizSchema) =>
											onSubmit(data)
										)}>
										<Stack direction="column" spacing="6">
											<Tabs>
												<TabList justifyContent="center" borderBottom="1px">
													<Tab sx={tabStyles}>{__('Info', 'masteriyo')}</Tab>
													<Tab sx={tabStyles}>
														{__('Questions', 'masteriyo')}
													</Tab>
													<Tab sx={tabStyles}>
														{__('Settings', 'masteriyo')}
													</Tab>
												</TabList>
												<TabPanels>
													<TabPanel px="0">
														<Stack direction="column" spacing="6">
															<Name />
															<Description />
														</Stack>
													</TabPanel>
													<TabPanel px="0">
														<Alert status="error">
															<AlertIcon />
															<AlertTitle mr={2}>
																{__('Add course first', 'masteriyo')}
															</AlertTitle>
															<AlertDescription>
																{__(
																	'In order to add questions. You need to add quiz first',
																	'masteriyo'
																)}
															</AlertDescription>
														</Alert>
													</TabPanel>
													<TabPanel px="0">
														<QuizSettings />
													</TabPanel>
												</TabPanels>
											</Tabs>

											<ButtonGroup>
												<Button
													colorScheme="blue"
													type="submit"
													isLoading={addQuiz.isLoading}>
													{__('Add New Quiz', 'masteriyo')}
												</Button>
												<Button
													variant="outline"
													onClick={() =>
														history.push({
															pathname: routes.courses.edit.replace(
																':courseId',
																courseId
															),
															search: '?page=builder',
														})
													}>
													{__('Cancel', 'masteriyo')}
												</Button>
											</ButtonGroup>
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

export default AddNewQuiz;
