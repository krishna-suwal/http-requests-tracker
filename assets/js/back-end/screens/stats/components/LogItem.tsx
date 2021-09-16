import {
	Avatar,
	Badge,
	Button,
	ButtonGroup,
	Icon,
	Stack,
	Td,
	Text,
	Tr,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { BiCalendar, BiTrash } from 'react-icons/bi';
import { LogType } from '../../../types';
import { getLocalTime, isEmpty } from '../../../utils/utils';

interface Props {
	data: LogType;
	onClickDelete: any;
}

const LogItem: React.FC<Props> = (props) => {
	const { data, onClickDelete } = props;
	const created_at = getLocalTime(data.created_at);

	return (
		<Tr>
			<Td>
				<Text fontWeight="semibold">{data.title}</Text>
			</Td>
			<Td>
				<Text fontWeight="semibold">{data.description}</Text>
			</Td>
			<Td>
				<Badge bg="blue.200" fontSize="10px" ml="2" mt="-2">
					{data.type}
				</Badge>
			</Td>
			<Td>
				{isEmpty(created_at) || 'Invalid Date' === created_at ? (
					<Text fontSize="xs" fontWeight="medium">
						—
					</Text>
				) : (
					<Stack
						direction="row"
						spacing="2"
						alignItems="center"
						color="gray.600">
						<Icon as={BiCalendar} />
						<Text fontSize="xs" fontWeight="medium">
							{created_at}
						</Text>
					</Stack>
				)}
			</Td>
			<Td>
				<Stack direction="row" spacing="2" alignItems="center">
					<Avatar src={data.user?.avatar_url} size="xs" />
					<Text fontSize="xs" fontWeight="medium" color="gray.600">
						{data.user?.display_name}
					</Text>
				</Stack>
			</Td>
			<Td>
				<ButtonGroup>
					<Button
						leftIcon={<BiTrash />}
						colorScheme="red"
						size="xs"
						onClick={onClickDelete}>
						{__('Delete')}
					</Button>
				</ButtonGroup>
			</Td>
		</Tr>
	);
};

export default LogItem;
