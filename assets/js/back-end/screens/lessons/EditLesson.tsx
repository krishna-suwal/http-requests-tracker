import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	ButtonGroup,
	Container,
	Divider,
	Flex,
	Heading,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Stack,
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BiDotsVerticalRounded, BiTrash } from 'react-icons/bi';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router';
import BackToBuilder from '../../components/common/BackToBuilder';
import Header from '../../components/common/Header';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import useCourse from '../../hooks/useCourse';
import { LessonSchema } from '../../schemas';
import API from '../../utils/api';
import { deepClean } from '../../utils/utils';
import FeaturedImage from '../courses/components/FeaturedImage';
import Description from './components/Description';
import Name from './components/Name';
import VideoSource from './components/VideoSource';

const EditLesson = () => {
	const { lessonId, courseId }: any = useParams();
	const { draftCourse, publishCourse } = useCourse();
	const history = useHistory();
	const methods = useForm();
	const toast = useToast();
	const cancelRef = useRef<any>();
	const lessonAPI = new API(urls.lessons);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

	const lessonQuery = useQuery<LessonSchema>(
		[`section${lessonId}`, lessonId],
		() => lessonAPI.get(lessonId)
	);

	const updateLesson = useMutation(
		(data: LessonSchema) => lessonAPI.update(lessonId, data),
		{
			onSuccess: (data: LessonSchema) => {
				toast({
					title: __('Lesson Updated Successfully', 'masteriyo'),
					description: data.name + __(' has been updated successfully.'),
					isClosable: true,
					status: 'success',
				});

				history.push({
					pathname: routes.courses.edit.replace(':courseId', courseId),
					search: '?page=builder',
				});
			},
		}
	);

	const deleteLesson = useMutation(
		(lessonId: number) => lessonAPI.delete(lessonId),
		{
			onSuccess: (data: any) => {
				toast({
					title: __('Lesson Deleted Successfully', 'masteriyo'),
					description: data.name + __(' has been deleted successfully.'),
					isClosable: true,
					status: 'error',
				});
				history.push({
					pathname: routes.courses.edit.replace(':courseId', data.course_id),
					search: '?page=builder',
				});
			},
		}
	);

	const onSubmit = (data: LessonSchema, status?: 'draft' | 'publish') => {
		status === 'draft' && draftCourse.mutate(courseId);
		status === 'publish' && publishCourse.mutate(courseId);
		updateLesson.mutate(deepClean(data));
	};

	const onDeletePress = () => {
		setDeleteModalOpen(true);
	};

	const onDeleteConfirm = () => {
		deleteLesson.mutate(lessonId);
	};

	const onDeleteModalClose = () => {
		setDeleteModalOpen(false);
	};

	if (lessonQuery.isSuccess && lessonQuery.data.course_id == courseId) {
		return (
			<Stack direction="column" spacing="8" alignItems="center">
				<Header
					showCourseName
					showLinks
					showPreview
					secondBtn={{
						label: 'Save to Draft',
						action: methods.handleSubmit((data: LessonSchema) =>
							onSubmit(data, 'draft')
						),
						isLoading: draftCourse.isLoading,
					}}
					thirdBtn={{
						label: 'Publish',
						action: methods.handleSubmit((data: LessonSchema) =>
							onSubmit(data, 'publish')
						),
						isLoading: publishCourse.isLoading,
					}}></Header>
				<Container maxW="container.xl">
					<Stack direction="column" spacing="6">
						<BackToBuilder />
						<FormProvider {...methods}>
							<Box bg="white" p="10" shadow="box">
								<Stack direction="column" spacing="8">
									<Flex aling="center" justify="space-between">
										<Heading as="h1" fontSize="x-large">
											{__('Edit Lesson', 'masteriyo')}
										</Heading>
										<Menu placement="bottom-end">
											<MenuButton
												as={IconButton}
												icon={<BiDotsVerticalRounded />}
												variant="outline"
												rounded="sm"
												fontSize="large"
											/>
											<MenuList>
												<MenuItem icon={<BiTrash />} onClick={onDeletePress}>
													{__('Delete', 'masteriyo')}
												</MenuItem>
											</MenuList>
										</Menu>
									</Flex>

									<form
										onSubmit={methods.handleSubmit((data: LessonSchema) =>
											onSubmit(data)
										)}>
										<Stack direction="column" spacing="6">
											<Name defaultValue={lessonQuery.data.name} />
											<Description
												defaultValue={lessonQuery.data.description}
											/>
											<FeaturedImage
												defaultValue={lessonQuery.data.featured_image}
											/>
											<VideoSource
												defaultSource={lessonQuery.data.video_source}
												defaultSourceUrl={lessonQuery.data.video_source_url}
											/>
											<Box py="3">
												<Divider />
											</Box>

											<ButtonGroup>
												<Button
													colorScheme="blue"
													type="submit"
													isLoading={updateLesson.isLoading}>
													{__('Update Lesson', 'masteriyo')}
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
							<AlertDialog
								isOpen={isDeleteModalOpen}
								onClose={onDeleteModalClose}
								isCentered
								leastDestructiveRef={cancelRef}>
								<AlertDialogOverlay>
									<AlertDialogContent>
										<AlertDialogHeader>
											{__('Delete Lesson')} {name}
										</AlertDialogHeader>

										<AlertDialogBody>
											{__(
												"Are you sure? You can't restore this lesson",
												'masteriyo'
											)}
										</AlertDialogBody>
										<AlertDialogFooter>
											<ButtonGroup>
												<Button
													ref={cancelRef}
													onClick={onDeleteModalClose}
													variant="outline">
													{__('Cancel', 'masteriyo')}
												</Button>
												<Button
													colorScheme="red"
													onClick={onDeleteConfirm}
													isLoading={deleteLesson.isLoading}>
													{__('Delete', 'masteriyo')}
												</Button>
											</ButtonGroup>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialogOverlay>
							</AlertDialog>
						</FormProvider>
					</Stack>
				</Container>
			</Stack>
		);
	}

	return <FullScreenLoader />;
};

export default EditLesson;
