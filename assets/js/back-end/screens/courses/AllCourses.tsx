import {
	Pagination,
	PaginationContainer,
	PaginationNext,
	PaginationPage,
	PaginationPageGroup,
	PaginationPrevious,
	PaginationSeparator,
	usePagination,
} from '@ajna/pagination';
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
	HStack,
	Icon,
	Link,
	List,
	ListIcon,
	ListItem,
	Select,
	Stack,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { BiBook, BiPlus } from 'react-icons/bi';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { NavLink, useHistory } from 'react-router-dom';
import Header from '../../components/common/Header';
import {
	navActiveStyles,
	navLinkStyles,
	tableStyles,
} from '../../config/styles';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import { SkeletonCourseList } from '../../skeleton';
import API from '../../utils/api';
import CourseFilter from './components/CourseFilter';
import CourseList from './components/CourseList';

interface FilterParams {
	category?: string | number;
	search?: string;
	status?: string;
	isOnlyFree?: boolean;
	price?: string | number;
	per_page?: number;
	page?: number;
}

const AllCourses = () => {
	const courseAPI = new API(urls.courses);
	const history = useHistory();
	const [filterParams, setFilterParams] = useState<FilterParams>({});
	const [deleteCourseId, setDeleteCourseId] = useState<number>();

	const queryClient = useQueryClient();
	const { onClose, onOpen, isOpen } = useDisclosure();
	const courseQuery = useQuery(['courseList', filterParams], () =>
		courseAPI.list(filterParams)
	);

	const cancelRef = React.useRef<any>();

	const {
		pages,
		pagesCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
	} = usePagination({
		total: courseQuery?.data?.meta?.total,
		limits: {
			outer: 2,
			inner: 2,
		},
		initialState: {
			pageSize: 10,
			isDisabled: false,
			currentPage: 1,
		},
	});

	const handlePageChange = (nextPage: number): void => {
		setFilterParams({
			page: nextPage,
			per_page: pageSize,
		});
		setCurrentPage(nextPage);
	};

	const handlePageSizeChange = (event: any): void => {
		const pageSize = Number(event.target.value);

		setFilterParams({
			per_page: pageSize,
		});
		setPageSize(pageSize);
	};

	const deleteCourse = useMutation((id: number) => courseAPI.delete(id), {
		onSuccess: () => {
			queryClient.invalidateQueries('courseList');
			onClose();
		},
	});

	const onDeletePress = (courseId: number) => {
		onOpen();
		setDeleteCourseId(courseId);
	};

	const onDeleteCofirm = () => {
		deleteCourseId && deleteCourse.mutate(deleteCourseId);
	};

	// Current page highest value. For e.g if 1 - 10, 10 is highest.
	const currentPageHighest =
		courseQuery?.data?.meta?.per_page * courseQuery?.data?.meta?.current_page;

	// Current page lowest value. For e.g if 1 - 10, 1 is lowest.
	const displayCurrentPageLowest =
		currentPageHighest - courseQuery?.data?.meta?.per_page + 1;

	// Setting highest value depending on current page is last page or not.
	const displayCurrentPageHighest =
		courseQuery?.data?.meta?.current_page === courseQuery?.data?.meta?.pages
			? courseQuery?.data?.meta?.total
			: currentPageHighest;

	return (
		<Stack direction="column" spacing="8" alignItems="center">
			<Header
				thirdBtn={{
					label: __('Add New Course', 'masteriyo'),
					action: () => history.push(routes.courses.add),
					icon: <Icon as={BiPlus} fontSize="md" />,
				}}>
				<List d="flex">
					<ListItem mb="0">
						<Link
							as={NavLink}
							sx={navLinkStyles}
							_activeLink={navActiveStyles}
							_hover={{ color: 'blue.500' }}
							to={routes.courses.list}>
							<ListIcon as={BiBook} />
							{__('All Courses', 'masteriyo')}
						</Link>
					</ListItem>
				</List>
			</Header>
			<Container maxW="container.xl">
				<Box bg="white" py="12" shadow="box" mx="auto">
					<Stack direction="column" spacing="10">
						<CourseFilter setFilterParams={setFilterParams} />

						<Stack direction="column" spacing="8">
							<Table size="sm" sx={tableStyles}>
								<Thead>
									<Tr>
										<Th>{__('Title', 'masteriyo')}</Th>
										<Th>{__('Categories', 'masteriyo')}</Th>
										<Th>{__('Author', 'masteriyo')}</Th>
										<Th>{__('Price', 'masteriyo')}</Th>
										<Th>{__('Date', 'masteriyo')}</Th>
										<Th>{__('Actions', 'masteriyo')}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{courseQuery.isLoading && <SkeletonCourseList />}
									{courseQuery.isSuccess &&
										courseQuery.data.data.map((course: any) => (
											<CourseList
												id={course.id}
												name={course.name}
												price={course.price}
												categories={course.categories}
												key={course.id}
												createdOn={course.date_created}
												permalink={course.permalink}
												author={course.author}
												onDeletePress={onDeletePress}
												status={course.status}
											/>
										))}
								</Tbody>
							</Table>
						</Stack>
					</Stack>
				</Box>
				{courseQuery.isSuccess && (
					<Stack
						mt="8"
						w="full"
						direction="row"
						justifyContent="space-between"
						pb="4"
						fontSize="sm">
						<Text color="gray.500">
							{__(
								`Showing ${displayCurrentPageLowest} - 
								${displayCurrentPageHighest}
								out of ${courseQuery?.data?.meta?.total}`,
								'masteriyo'
							)}
						</Text>
						<HStack>
							<Text color="gray.500">
								{__('Courses Per Page:', 'masteriyo')}
							</Text>
							<Select
								size="sm"
								defaultValue={courseQuery?.data?.meta?.per_page}
								ml={3}
								onChange={handlePageSizeChange}
								w={20}>
								<option value="5">5</option>
								<option value="10">10</option>
								<option value="20">20</option>
								<option value="30">30</option>
								<option value="40">40</option>
								<option value="50">50</option>
							</Select>
							<Pagination
								pagesCount={pagesCount}
								currentPage={currentPage}
								onPageChange={handlePageChange}>
								<PaginationContainer>
									<Stack direction="row" spacing="1">
										<PaginationPrevious size="sm" shadow="none">
											<FaChevronLeft />
										</PaginationPrevious>
										<PaginationPageGroup
											isInline
											align="center"
											separator={
												<PaginationSeparator fontSize="sm" w={7} jumpSize={3} />
											}>
											{pages.map((page: number) => (
												<PaginationPage
													shadow="none"
													h="8"
													w="8"
													key={`pagination_page_${page}`}
													page={page}
													_hover={{
														bg: 'blue.400',
													}}
													_current={{
														bg: 'blue.400',
														fontSize: 'sm',
														color: 'white',
													}}
												/>
											))}
										</PaginationPageGroup>
										<PaginationNext size="sm" shadow="none">
											<FaChevronRight />
										</PaginationNext>
									</Stack>
								</PaginationContainer>
							</Pagination>
						</HStack>
					</Stack>
				)}
			</Container>
			<AlertDialog
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				leastDestructiveRef={cancelRef}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>
							{__('Deleting Course')} {name}
						</AlertDialogHeader>
						<AlertDialogBody>
							{__("Are you sure? You can't restore this back", 'masteriyo')}
						</AlertDialogBody>
						<AlertDialogFooter>
							<ButtonGroup>
								<Button onClick={onClose} variant="outline" ref={cancelRef}>
									{__('Cancel', 'masteriyo')}
								</Button>
								<Button
									colorScheme="red"
									isLoading={deleteCourse.isLoading}
									onClick={onDeleteCofirm}>
									{__('Delete', 'masteriyo')}
								</Button>
							</ButtonGroup>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Stack>
	);
};

export default AllCourses;
