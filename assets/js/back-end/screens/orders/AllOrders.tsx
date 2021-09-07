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
	Box,
	Container,
	HStack,
	Link,
	List,
	ListItem,
	Select,
	Stack,
	Table,
	Tbody,
	Text,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { NavLink } from 'react-router-dom';
import Header from '../../components/common/Header';
import {
	navActiveStyles,
	navLinkStyles,
	tableStyles,
} from '../../config/styles';
import routes from '../../constants/routes';
import urls from '../../constants/urls';
import { SkeletonOrdersList } from '../../skeleton';
import API from '../../utils/api';
import OrderRow from './components/OrderRow';

interface FilterParams {
	per_page?: number;
	page?: number;
}

const AllOrders = () => {
	const [filterParams, setFilterParams] = useState<FilterParams>({});
	const ordersAPI = new API(urls.orders);
	const ordersQuery = useQuery(['ordersList', filterParams], () =>
		ordersAPI.list(filterParams)
	);

	const {
		pages,
		pagesCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
	} = usePagination({
		total: ordersQuery?.data?.meta?.total,
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

	// Current page highest value. For e.g if 1 - 10, 10 is highest.
	const currentPageHighest =
		ordersQuery?.data?.meta?.per_page * ordersQuery?.data?.meta?.current_page;

	// Current page lowest value. For e.g if 1 - 10, 1 is lowest.
	const displayCurrentPageLowest =
		currentPageHighest - ordersQuery?.data?.meta?.per_page + 1;

	// Setting highest value depending on current page is last page or not.
	const displayCurrentPageHighest =
		ordersQuery?.data?.meta?.current_page === ordersQuery?.data?.meta?.pages
			? ordersQuery?.data?.meta?.total
			: currentPageHighest;

	return (
		<Stack direction="column" spacing="8" alignItems="center">
			<Header showLinks>
				<List>
					<ListItem>
						<Link
							as={NavLink}
							sx={navLinkStyles}
							_activeLink={navActiveStyles}
							to={routes.orders.list}>
							{__('Orders', 'masteriyo')}
						</Link>
					</ListItem>
				</List>
			</Header>
			<Container maxW="container.xl" marginTop="6">
				<Box bg="white" py="12" shadow="box" mx="auto">
					<Stack direction="column" spacing="8">
						<Stack direction="column" spacing="8">
							<Table size="sm" sx={tableStyles}>
								<Thead>
									<Tr>
										<Th>{__('Order', 'masteriyo')}</Th>
										<Th>{__('Date', 'masteriyo')}</Th>
										<Th>{__('Status', 'masteriyo')}</Th>
										<Th>{__('Total', 'masteriyo')}</Th>
										<Th>{__('Actions', 'masteriyo')}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{ordersQuery.isLoading && <SkeletonOrdersList />}
									{ordersQuery.isSuccess &&
										ordersQuery.data.data.map((order: any) => (
											<OrderRow key={order.id} data={order} />
										))}
								</Tbody>
							</Table>
						</Stack>
					</Stack>
				</Box>
				{ordersQuery.isSuccess && (
					<Stack
						mt="8"
						w="full"
						direction="row"
						justifyContent="space-between"
						pb="4">
						<Text color="gray.500">
							{__(
								`Showing ${displayCurrentPageLowest} - 
								${displayCurrentPageHighest}
								out of ${ordersQuery?.data?.meta?.total}`,
								'masteriyo'
							)}
						</Text>
						<HStack>
							<Text color="gray.500">
								{__('Orders Per Page:', 'masteriyo')}
							</Text>
							<Select
								defaultValue={ordersQuery?.data?.meta?.per_page}
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
		</Stack>
	);
};

export default AllOrders;
