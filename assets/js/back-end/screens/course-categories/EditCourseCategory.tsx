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
	Icon,
	IconButton,
	Link,
	List,
	ListItem,
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
import { BiChevronLeft, BiDotsVerticalRounded, BiTrash } from 'react-icons/bi';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import Header from '../../components/common/Header';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import { navActiveStyles, navLinkStyles } from '../../config/styles';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import API from '../../utils/api';
import { deepClean } from '../../utils/utils';
import DescriptionInput from './components/DescriptionInput';
import NameInput from './components/NameInput';
import SlugInput from './components/SlugInput';

const EditCourseCategory = () => {
	const { categoryId }: any = useParams();
	const history = useHistory();
	const methods = useForm();
	const toast = useToast();
	const cancelRef = useRef<any>();
	const categoryAPI = new API(urls.categories);
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const queryClient = useQueryClient();

	const categoryQuery = useQuery(
		[`courseCategory${categoryId}`, categoryId],
		() => categoryAPI.get(categoryId)
	);

	const updateCategory = useMutation(
		(data: object) => categoryAPI.update(categoryId, data),
		{
			onSuccess: (data: any) => {
				toast({
					title: __('Category Updated Successfully', 'masteriyo'),
					description: data.name + __(' has been updated successfully.'),
					isClosable: true,
					status: 'success',
				});
				categoryQuery.refetch();
				queryClient.invalidateQueries('courseCategoriesList');
				history.push(routes.course_categories.list);
			},
			onError: (error: any) => {
				toast({
					title: __('Failed to update category', 'masteriyo'),
					description: `${error.response?.data?.message}`,
					isClosable: true,
					status: 'error',
				});
			},
		}
	);

	const deleteCategory = useMutation(
		(categoryId: number) => categoryAPI.delete(categoryId, { force: true }),
		{
			onSuccess: (data: any) => {
				toast({
					title: __('Category Deleted Successfully', 'masteriyo'),
					description: data.name + __(' has been deleted successfully.'),
					isClosable: true,
					status: 'error',
				});
				history.push(routes.course_categories.list);
				queryClient.invalidateQueries('courseCategoriesList');
			},
			onError: (error: any) => {
				toast({
					title: __('Failed to delete category', 'masteriyo'),
					description: `${error.response?.data?.message}`,
					isClosable: true,
					status: 'error',
				});
			},
		}
	);

	const onSubmit = (data: object) => {
		updateCategory.mutate(deepClean(data));
	};

	const onDeletePress = () => {
		setDeleteModalOpen(true);
	};

	const onDeleteConfirm = () => {
		deleteCategory.mutate(categoryId);
	};

	const onDeleteModalClose = () => {
		setDeleteModalOpen(false);
	};

	if (categoryQuery.isLoading) {
		return <FullScreenLoader />;
	}

	return (
		<Stack direction="column" spacing="8" alignItems="center">
			<Header showLinks>
				<List>
					<ListItem>
						<Link
							as={NavLink}
							sx={navLinkStyles}
							_activeLink={navActiveStyles}
							to={routes.course_categories.list}>
							{__('Categories', 'masteriyo')}
						</Link>
					</ListItem>
				</List>
			</Header>
			<Container maxW="container.xl">
				<Stack direction="column" spacing="6">
					<ButtonGroup>
						<RouterLink to={routes.course_categories.list}>
							<Button
								variant="link"
								_hover={{ color: 'blue.500' }}
								leftIcon={<Icon fontSize="xl" as={BiChevronLeft} />}>
								{__('Back to Categories', 'masteriyo')}
							</Button>
						</RouterLink>
					</ButtonGroup>
					<FormProvider {...methods}>
						<Box bg="white" p="10" shadow="box">
							<Stack direction="column" spacing="8">
								<Flex aling="center" justify="space-between">
									<Heading as="h1" fontSize="x-large">
										{__('Edit Category', 'masteriyo')}
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

								<form onSubmit={methods.handleSubmit(onSubmit)}>
									<Stack direction="column" spacing="6">
										<NameInput defaultValue={categoryQuery.data.name} />
										<SlugInput defaultValue={categoryQuery.data.slug} />
										<DescriptionInput
											defaultValue={categoryQuery.data.description}
										/>

										<Box py="3">
											<Divider />
										</Box>

										<ButtonGroup>
											<Button
												colorScheme="blue"
												type="submit"
												isLoading={updateCategory.isLoading}>
												{__('Update', 'masteriyo')}
											</Button>
											<Button
												variant="outline"
												onClick={() =>
													history.push(routes.course_categories.list)
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
										{__('Delete Category')} {name}
									</AlertDialogHeader>

									<AlertDialogBody>
										{__(
											"Are you sure? You can't restore this category",
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
												isLoading={deleteCategory.isLoading}>
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
};

export default EditCourseCategory;
