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
	Stack,
	Table,
	Tbody,
	Th,
	Thead,
	Tr,
	useDisclosure,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import Pagination from '../../components/common/Pagination';
import { tableStyles } from '../../config/styles';
import urls from '../../constants/urls';
import { SkeletonLogsList } from '../../skeleton';
import { LogType } from '../../types';
import API from '../../utils/api';
import EmptyInfo from './components/EmptyInfo';
import LogItem from './components/LogItem';
import LogsFilter from './components/LogsFilter';

interface FilterParams {
	type?: string;
	user_id?: string | number;
	per_page?: number;
	page?: number;
}
interface MetaData {
	total: number;
	pages: number;
	current_page: number;
	per_page: number;
}
interface LogsDataType {
	data: LogType[];
	meta: MetaData;
	extra: {
		users: { id: number; display_name: string; avatar_url: string }[];
	};
}

const Logs: React.FC = () => {
	const [filterParams, setFilterParams] = useState<FilterParams>({});
	const cancelRef = React.useRef<any>();

	const { onClose, onOpen, isOpen } = useDisclosure();
	const toast = useToast({
		position: 'bottom-right',
	});
	const logsApi = new API(urls.logs);
	const logsQuery = useQuery<LogsDataType>(
		['logs', filterParams],
		() => logsApi.list(filterParams),
		{
			onError: (error: any) => {
				toast({
					title: __('Failed to fetch logs', 'masteriyo'),
					description: `${error.response?.data?.message}`,
					isClosable: true,
					status: 'error',
				});
				console.error(error);
			},
		}
	);

	return (
		<>
			<Container maxW="container.xl">
				<Box bg="white" py="12" shadow="box" mx="auto">
					<Stack direction="column" spacing="10">
						{logsQuery.isSuccess && (
							<LogsFilter
								filterParams={filterParams}
								setFilterParams={setFilterParams}
								users={logsQuery.data?.extra.users}
							/>
						)}

						<Stack direction="column" spacing="8">
							<Table size="sm" sx={tableStyles}>
								<Thead>
									<Tr>
										<Th>{__('Title', 'hrt')}</Th>
										<Th>{__('Description', 'hrt')}</Th>
										<Th>{__('Type', 'hrt')}</Th>
										<Th>{__('Date', 'masteriyo')}</Th>
										<Th>{__('Author', 'hrt')}</Th>
										<Th>{__('Actions', 'hrt')}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{logsQuery.isLoading && <SkeletonLogsList />}
									{logsQuery.isSuccess && logsQuery?.data?.data.length === 0 ? (
										<EmptyInfo message={__('No logs found.', 'hrt')} />
									) : (
										logsQuery.data?.data?.map((item: any, index: number) => (
											<LogItem
												key={item.id}
												data={item}
												onClickDelete={() => index}
											/>
										))
									)}
								</Tbody>
							</Table>
						</Stack>
					</Stack>
				</Box>
				{logsQuery.isSuccess && logsQuery?.data?.data.length > 0 && (
					<Pagination
						metaData={logsQuery.data.meta}
						setFilterParams={setFilterParams}
						perPageText="Logs Per Page:"
					/>
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
							{__("Are you sure? You can't restore this back", 'hrt')}
						</AlertDialogBody>
						<AlertDialogFooter>
							<ButtonGroup>
								<Button onClick={onClose} variant="outline" ref={cancelRef}>
									{__('Cancel', 'hrt')}
								</Button>
								{/* <Button
									colorScheme="red"
									isLoading={deleteCourse.isLoading}
									onClick={onDeleteCofirm}>
									{__('Delete', 'hrt')}
								</Button> */}
							</ButtonGroup>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default Logs;
