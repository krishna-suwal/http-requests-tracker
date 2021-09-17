import {
	Avatar,
	Box,
	Divider,
	Heading,
	Stack,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tr,
	useColorModeValue,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useQuery } from 'react-query';
import { tableStyles } from '../../config/styles';
import urls from '../../constants/urls';
import { SkeletonStatistics } from '../../skeleton';
import { StatsMap } from '../../types';
import API from '../../utils/api';
import { isEmpty } from '../../utils/utils';
import EmptyInfo from './components/EmptyInfo';
import { getLogTypeLabel } from './data';

interface Props {}

const Statistics: React.FC<Props> = () => {
	const toast = useToast({
		position: 'bottom-right',
	});
	const statsApi = new API(urls.stats);
	const tableBorderColor = useColorModeValue('gray.100', 'gray.700');
	const titleColor = useColorModeValue('gray.600', 'gray.300');
	const authorColor = useColorModeValue('gray.600', 'gray.400');
	const statsQuery = useQuery<StatsMap>('stats', () => statsApi.list(), {
		onError: (error: any) => {
			toast({
				title: __('Failed to fetch logs', 'hrt'),
				description: `${error.response?.data?.message}`,
				isClosable: true,
				status: 'error',
			});
			console.error(error);
		},
	});

	return (
		<Box
			py="12"
			mx="auto"
			border="1px"
			borderRadius="md"
			borderColor={tableBorderColor}>
			<Stack px="12">
				<Heading fontSize="md" fontWeight="medium" mb="8">
					{__('Based on Types', 'hrt')}
				</Heading>
			</Stack>
			<Table size="sm" sx={tableStyles} variant="striped">
				<Thead>
					<Tr>
						<Th>{__('Type', 'hrt')}</Th>
						<Th>{__('Logs Count', 'hrt')}</Th>
					</Tr>
				</Thead>
				<Tbody>
					{statsQuery.isLoading && <SkeletonStatistics />}
					{statsQuery.isSuccess &&
						statsQuery.data &&
						Object.entries(statsQuery.data?.basic.types).map(
							([type, count]) => (
								<Tr key={type}>
									<Td>
										<Text color={titleColor}>{getLogTypeLabel(type)}</Text>
									</Td>
									<Td>
										<Text>{count}</Text>
									</Td>
								</Tr>
							)
						)}
				</Tbody>
			</Table>

			<Divider my="8" />

			<Stack px="12">
				<Heading fontSize="md" fontWeight="medium" mb="8">
					{__('Based on Users', 'hrt')}
				</Heading>
			</Stack>
			<Table size="sm" sx={tableStyles} variant="striped">
				<Thead>
					<Tr>
						<Th>{__('User', 'hrt')}</Th>
						<Th>{__('Logs Count', 'hrt')}</Th>
					</Tr>
				</Thead>
				<Tbody>
					{statsQuery.isLoading && <SkeletonStatistics />}
					{statsQuery.isSuccess &&
						statsQuery.data &&
						(isEmpty(statsQuery.data?.basic.users) ? (
							<EmptyInfo message={__('Nothing found.', 'hrt')} />
						) : (
							statsQuery.data?.basic.users.map((user) => (
								<Tr key={user.id}>
									<Td>
										<Stack direction="row" spacing="2" alignItems="center">
											<Avatar src={user.avatar_url} size="xs" />
											<Text
												fontSize="xs"
												fontWeight="medium"
												color={authorColor}>
												{user.display_name}
											</Text>
										</Stack>
									</Td>
									<Td>
										<Text>{user.count}</Text>
									</Td>
								</Tr>
							))
						))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default Statistics;
