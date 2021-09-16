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
import { HStack, Select, Stack, Text } from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface MetaData {
	total: number;
	pages: number;
	current_page: number;
	per_page: number;
}

interface Props {
	metaData: MetaData;
	setFilterParams: any;
	perPageText: string;
	outerLimits?: number;
	innerLimits?: number;
}

const HrtPagination: React.FC<Props> = (props) => {
	const {
		metaData,
		setFilterParams,
		perPageText,
		outerLimits = 2,
		innerLimits = 2,
	} = props;

	const {
		pages,
		pagesCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
	} = usePagination({
		total: metaData?.total,
		limits: {
			outer: outerLimits,
			inner: innerLimits,
		},
		initialState: {
			pageSize: metaData?.per_page,
			isDisabled: false,
			currentPage: metaData?.current_page,
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
	const currentPageHighest = metaData?.per_page * metaData?.current_page;

	// Current page lowest value. For e.g if 1 - 10, 1 is lowest.
	const displayCurrentPageLowest = currentPageHighest - metaData?.per_page + 1;

	// Setting highest value depending on current page is last page or not.
	const displayCurrentPageHighest =
		metaData?.current_page === metaData?.pages
			? metaData?.total
			: currentPageHighest;

	return (
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
					out of ${metaData?.total}`,
					'masteriyo'
				)}
			</Text>
			<HStack>
				<Text color="gray.500">{perPageText}</Text>
				<Select
					size="sm"
					defaultValue={metaData?.per_page}
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
	);
};

export default HrtPagination;
