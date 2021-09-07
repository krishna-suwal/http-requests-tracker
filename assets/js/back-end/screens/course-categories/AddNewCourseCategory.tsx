import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Divider,
	Icon,
	Link,
	List,
	ListItem,
	Stack,
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BiChevronLeft } from 'react-icons/bi';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import Header from '../../components/common/Header';
import { navActiveStyles, navLinkStyles } from '../../config/styles';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import API from '../../utils/api';
import { deepClean } from '../../utils/utils';
import DescriptionInput from './components/DescriptionInput';
import NameInput from './components/NameInput';
import SlugInput from './components/SlugInput';

const AddNewCourseCategory = () => {
	const history = useHistory();
	const methods = useForm();
	const toast = useToast();
	const queryClient = useQueryClient();
	const categoryAPI = new API(urls.categories);

	const createCategory = useMutation(
		(data: object) => categoryAPI.store(data),
		{
			onSuccess: (data: any) => {
				toast({
					title: __('Category Added', 'masteriyo'),
					description: data.name + __(' is successfully added.', 'masteriyo'),
					isClosable: true,
					status: 'success',
				});
				history.push(routes.course_categories.list);
				queryClient.invalidateQueries('courseCategoriesList');
				queryClient.invalidateQueries('categoryLists');
			},
			onError: (error: any) => {
				toast({
					title: __('Failed to create category', 'masteriyo'),
					description: `${error.response?.data?.message}`,
					isClosable: true,
					status: 'error',
				});
			},
		}
	);

	const onSubmit = (data: object) => {
		createCategory.mutate(deepClean(data));
	};

	return (
		<Stack direction="column" spacing="8" alignItems="center">
			<Header>
				<List>
					<ListItem>
						<Link
							as={NavLink}
							sx={navLinkStyles}
							_activeLink={navActiveStyles}
							to={routes.course_categories.add}>
							{__('Add New Category', 'masteriyo')}
						</Link>
					</ListItem>
				</List>
			</Header>
			<Container maxW="container.xl" marginTop="6">
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
								<form onSubmit={methods.handleSubmit(onSubmit)}>
									<Stack direction="column" spacing="6">
										<NameInput />
										<SlugInput />
										<DescriptionInput />

										<Box py="3">
											<Divider />
										</Box>

										<ButtonGroup>
											<Button
												colorScheme="blue"
												type="submit"
												isLoading={createCategory.isLoading}>
												{__('Create', 'masteriyo')}
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
					</FormProvider>
				</Stack>
				/
			</Container>
		</Stack>
	);
};

export default AddNewCourseCategory;
