import {
	Avatar,
	Badge,
	Button,
	ButtonGroup,
	Stack,
	Td,
	Text,
	Tr,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { Link as RouterLink } from 'react-router-dom';
import routes from '../../../constants/routes';
import { UrlSchemeType } from '../../../types';

interface Props extends UrlSchemeType {
	onClickEdit: any;
	onClickDelete: any;
}

const UrlSchemeItem: React.FC<Props> = (props) => {
	const { id, title, type, author, onClickEdit, onClickDelete } = props;

	return (
		<Tr>
			<Td>
				<Text fontWeight="semibold">{title}</Text>
			</Td>
			<Td>
				<Badge bg="blue.200" fontSize="10px" ml="2" mt="-2">
					{type}
				</Badge>
			</Td>
			<Td>
				<Stack direction="row" spacing="2" alignItems="center">
					<Avatar src={author?.avatar_url} size="xs" />
					<Text fontSize="xs" fontWeight="medium" color="gray.600">
						{author?.display_name}
					</Text>
				</Stack>
			</Td>
			<Td>
				<ButtonGroup>
					<RouterLink
						to={routes.urlSchemes.edit.replace(':urlSchemId', id.toString())}>
						<Button
							leftIcon={<BiEdit />}
							colorScheme="blue"
							size="xs"
							onClick={onClickEdit}>
							{__('Edit')}
						</Button>
					</RouterLink>
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

export default UrlSchemeItem;
