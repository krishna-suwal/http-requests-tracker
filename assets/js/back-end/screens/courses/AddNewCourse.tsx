import {
	Box,
	Container,
	Heading,
	Icon,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BiBook, BiCog, BiEdit } from 'react-icons/bi';
import { useMutation } from 'react-query';
import { useHistory } from 'react-router-dom';
import AddCategoryModal from '../../components/common/AddCategoryModal';
import Header from '../../components/common/Header';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import { CourseSchema } from '../../schemas';
import API from '../../utils/api';
import { deepClean, deepMerge } from '../../utils/utils';
import CourseSetting from '../builder/component/CourseSetting';
import Categories from './components/Categories';
import Description from './components/Description';
import FeaturedImage from './components/FeaturedImage';
import Hightlights from './components/Highlights';
import Name from './components/Name';

const AddNewCourse: React.FC = () => {
	const history = useHistory();
	const methods = useForm();
	const courseAPI = new API(urls.courses);

	const tabStyles = {
		fontWeight: 'medium',
		fontSize: 'sm',
		py: '6',
		px: 0,
		mx: 4,
	};

	const tabPanelStyles = {
		px: '0',
	};

	const iconStyles = {
		mr: '2',
	};

	const addMutation = useMutation((data: CourseSchema) =>
		courseAPI.store(data)
	);

	// On Add Course
	const onSubmit = (data: CourseSchema) => {
		const newData = {
			...(data.categories && {
				categories: data.categories.map((category: any) => ({
					id: category.value,
				})),
			}),
			regular_price: `${data.regular_price}`,
			status: 'draft',
		};

		addMutation.mutate(deepClean(deepMerge(data, newData)), {
			onSuccess: (data: CourseSchema) => {
				history.push({
					pathname: routes.courses.edit.replace(
						':courseId',
						data.id.toString()
					),
					search: '?page=builder',
				});
			},
		});
	};

	return (
		<>
			<FormProvider {...methods}>
				<Tabs>
					<Stack direction="column" spacing="8" alignItems="center">
						<Header
							thirdBtn={{
								label: __('Next', 'masteriyo'),
								action: methods.handleSubmit(onSubmit),
								isLoading: addMutation.isLoading,
							}}>
							<TabList borderBottom="none" bg="white">
								<Tab sx={tabStyles}>
									<Icon as={BiBook} sx={iconStyles} />
									{__('Course', 'masteriyo')}
								</Tab>
								<Tab sx={tabStyles} isDisabled>
									<Icon as={BiEdit} sx={iconStyles} />
									{__('Builder', 'masteriyo')}
								</Tab>
								<Tab sx={tabStyles}>
									<Icon as={BiCog} sx={iconStyles} />
									{__('Settings', 'masteriyo')}
								</Tab>
							</TabList>
						</Header>
						<Container maxW="container.xl">
							<Stack direction="column" spacing="8">
								<Heading as="h1" size="xl">
									{__('Add New Course', 'masteriyo')}
								</Heading>
								<TabPanels>
									<TabPanel sx={tabPanelStyles}>
										<form>
											<Stack direction="row" spacing="8">
												<Box
													flex="1"
													bg="white"
													p="10"
													shadow="box"
													d="flex"
													flexDirection="column"
													justifyContent="space-between">
													<Stack direction="column" spacing="6">
														<Name />
														<Description />
													</Stack>
												</Box>
												<Box w="400px" bg="white" p="10" shadow="box">
													<Stack direction="column" spacing="6">
														<Hightlights />
														<Categories />
														<FeaturedImage />
													</Stack>
												</Box>
											</Stack>
										</form>
									</TabPanel>
									<TabPanel></TabPanel>
									<TabPanel sx={tabPanelStyles}>
										<CourseSetting />
									</TabPanel>
								</TabPanels>
							</Stack>
						</Container>
					</Stack>
				</Tabs>
			</FormProvider>
			<AddCategoryModal />
		</>
	);
};

export default AddNewCourse;
