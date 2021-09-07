import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	ButtonGroup,
	Container,
	Icon,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import queryString from 'query-string';
import React, { useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BiBook, BiCog, BiEdit } from 'react-icons/bi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import AddCategoryModal from '../../components/common/AddCategoryModal';
import Header from '../../components/common/Header';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import useCourse from '../../hooks/useCourse';
import { CourseDataMap } from '../../types/course';
import API from '../../utils/api';
import { deepClean, deepMerge } from '../../utils/utils';
import EditCourse from '../courses/EditCourse';
import SectionBuilder from '../sections/SectionBuilder';
import CourseSetting from './component/CourseSetting';

const Builder: React.FC = () => {
	const { courseId }: any = useParams();
	const { search } = useLocation();
	const { onClose, onOpen, isOpen } = useDisclosure();
	const queryClient = useQueryClient();
	const toast = useToast();
	const methods = useForm();
	const history = useHistory();
	const cancelRef = useRef<any>();
	const course = useCourse();

	const courseAPI = new API(urls.courses);
	const builderAPI = new API(urls.builder);
	const sectionAPI = new API(urls.sections);

	const [builderData, setBuilderData] = useState<any>(null);
	const [deleteSectionId, setDeleteSectionId] = useState<number>();
	const { page } = queryString.parse(search);
	const [tabIndex, setTabIndex] = useState<number>(
		page === 'builder' ? 1 : page === 'settings' ? 2 : 0
	);

	const tabStyles = {
		fontWeight: 'medium',
		fontSize: 'sm',
		py: '6',
		px: 0,
		mx: 4,
		_hover: {
			color: 'blue.500',
		},
	};

	const tabPanelStyles = {
		px: '0',
	};

	const iconStyles = {
		mr: '2',
	};

	const courseQuery = useQuery<CourseDataMap>(
		[`course${courseId}`, courseId],
		() => courseAPI.get(courseId),
		{
			onSuccess: (data: CourseDataMap) => {
				course.setCourseName(data.name);
				course.setPreviewUrl(data.preview_permalink);
			},
		}
	);

	const builderQuery = useQuery(
		[`builder${courseId}`, courseId],
		() => builderAPI.get(courseId),
		{
			onSuccess: (data) => {
				setBuilderData(data);
			},
		}
	);

	const updateCourse = useMutation(
		(data: CourseDataMap) => courseAPI.update(courseId, data),
		{
			onSuccess: (data: CourseDataMap) => {
				toast({
					title: data.name + __(' is Published successfully.', 'masteriyo'),
					description: __('You can keep editing it', 'masteriyo'),
					status: 'success',
					isClosable: true,
				});
				queryClient.invalidateQueries(`course${data.id}`);
			},
		}
	);

	const draftCourse = useMutation(
		(data: CourseDataMap) => courseAPI.update(courseId, data),
		{
			onSuccess: (data: CourseDataMap) => {
				toast({
					title: data.name + __(' is drafted successfully.', 'masteriyo'),
					description: __('You can keep editing it', 'masteriyo'),
					status: 'success',
					isClosable: true,
				});
				queryClient.invalidateQueries(`course${data.id}`);
			},
		}
	);

	const updateBuilder = useMutation(
		(data: any) => builderAPI.update(courseId, data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(`builder${courseId}`);
			},
		}
	);

	const onSave = (data: any, type: string) => {
		updateBuilder.mutate(deepClean(builderData));

		const newData: any = {
			...(data.categories && {
				categories: data.categories.map((category: any) => ({
					id: category.value,
				})),
				status: type,
			}),
			duration: (data?.duration_hour || 0) * 60 + +(data?.duration_minute || 0),
			duration_hour: null,
			duration_minute: null,
			regular_price: `${data.regular_price}`,
		};

		if (type === 'draft') {
			draftCourse.mutate(deepClean(deepMerge(data, newData)));
		} else {
			updateCourse.mutate(deepClean(deepMerge(data, newData)));
		}
	};

	const deleteMutation = useMutation((id: number) => sectionAPI.delete(id), {
		onSuccess: (data: any) => {
			onClose();
			toast({
				title: __('Section Deleted', 'masteriyo'),
				description:
					data?.name + __(' has been deleted successfully', 'masteriyo'),
				isClosable: true,
				status: 'error',
			});
			queryClient.invalidateQueries(`builder${courseId}`);
		},
		onError: (error: any) => {
			onClose();
			toast({
				title: __('Failed to delete section', 'masteriyo'),
				description: `${error.response?.data?.message}`,
				isClosable: true,
				status: 'error',
			});
		},
	});

	const onDeletePress = (sectionId: number) => {
		onOpen();
		setDeleteSectionId(sectionId);
	};

	const onDeleteConfirm = () => {
		deleteSectionId && deleteMutation.mutate(deleteSectionId);
	};

	if (courseQuery.isSuccess && builderQuery.isSuccess) {
		return (
			<>
				<FormProvider {...methods}>
					<Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
						<Stack direction="column" spacing="8" align="center">
							<Header
								showCourseName
								course={{
									name: courseQuery.data.name,
									id: courseQuery.data.id,
								}}
								firstBtn={{
									label: __('Preview', 'masteriyo'),
									action: () => window.open(courseQuery.data.preview_permalink),
								}}
								secondBtn={{
									label: __('Save To Draft', 'masteriyo'),
									action: methods.handleSubmit((data) => onSave(data, 'draft')),
									isLoading: draftCourse.isLoading,
									isDisabled: updateCourse.isLoading,
								}}
								thirdBtn={{
									label: __('Publish', 'masteriyo'),
									action: methods.handleSubmit((data) =>
										onSave(data, 'publish')
									),
									isLoading: updateCourse.isLoading,
									isDisabled: draftCourse.isLoading,
								}}>
								<TabList borderBottom="none" bg="white">
									<Tab
										sx={tabStyles}
										onClick={() => {
											history.push(
												routes.courses.edit.replace(':courseId', courseId)
											);
										}}>
										<Icon as={BiBook} sx={iconStyles} />
										{__('Course', 'masteriyo')}
									</Tab>
									<Tab
										sx={tabStyles}
										onClick={() => {
											history.push({
												pathname: routes.courses.edit.replace(
													':courseId',
													courseId
												),
												search: '?page=builder',
											});
										}}>
										<Icon as={BiEdit} sx={iconStyles} />
										{__('Builder', 'masteriyo')}
									</Tab>
									<Tab
										sx={tabStyles}
										onClick={() => {
											history.push({
												pathname: routes.courses.edit.replace(
													':courseId',
													courseId
												),
												search: '?page=settings',
											});
										}}>
										<Icon as={BiCog} sx={iconStyles} />
										{__('Settings', 'masteriyo')}
									</Tab>
								</TabList>
							</Header>
							<Container maxW="container.xl">
								<Stack direction="column" spacing="2">
									<TabPanels>
										<TabPanel sx={tabPanelStyles}>
											<EditCourse courseData={courseQuery.data} />
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<SectionBuilder
												courseId={courseQuery.data.id}
												builderData={
													(builderData && builderData) || builderQuery.data
												}
												setBuilderData={setBuilderData}
												onDeletePress={onDeletePress}
											/>
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<CourseSetting courseData={courseQuery.data} />
										</TabPanel>
									</TabPanels>
								</Stack>
							</Container>
						</Stack>
					</Tabs>
				</FormProvider>
				<AddCategoryModal />
				<AlertDialog
					isOpen={isOpen}
					onClose={onClose}
					isCentered
					leastDestructiveRef={cancelRef}>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader>
								{__('Delete Section')} {name}
							</AlertDialogHeader>
							<AlertDialogBody>
								{__(
									"Are you sure? You can't restore this section",
									'masteriyo'
								)}
							</AlertDialogBody>
							<AlertDialogFooter>
								<ButtonGroup>
									<Button ref={cancelRef} onClick={onClose} variant="outline">
										{__('Cancel', 'masteriyo')}
									</Button>
									<Button
										colorScheme="red"
										onClick={onDeleteConfirm}
										isLoading={deleteMutation.isLoading}>
										{__('Delete', 'masteriyo')}
									</Button>
								</ButtonGroup>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</AlertDialog>
			</>
		);
	}
	return <FullScreenLoader />;
};

export default Builder;
