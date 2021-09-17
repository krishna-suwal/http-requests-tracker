import {
	Avatar,
	Badge,
	Button,
	ButtonGroup,
	Stack,
	Switch,
	Td,
	Text,
	Tr,
	useColorModeValue,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { Link as RouterLink } from 'react-router-dom';
import routes from '../../../constants/routes';
import { UrlSchemeType } from '../../../types';
import { isEmpty } from '../../../utils/utils';
import { getSchemeTypeLabel } from '../data';

const getExtraData = (scheme: UrlSchemeType) => {
	let str: any = '—';

	if ('regex' === scheme.type) {
		str = isEmpty(scheme.regex) ? str : scheme.regex;
	}
	if ('absolute' === scheme.type || 'relative' === scheme.type) {
		str = isEmpty(scheme.url) ? str : scheme.url;
	}
	return str;
};

interface Props {
	data: UrlSchemeType;
	onClickDelete: any;
	onChangeEnable: any;
}

const UrlSchemeItem: React.FC<Props> = (props) => {
	const { data, onClickDelete, onChangeEnable } = props;
	const authorColor = useColorModeValue('gray.600', 'gray.50');

	return (
		<Tr>
			<Td>
				<Switch
					colorScheme="green"
					defaultChecked={data.enable}
					onChange={(e) => onChangeEnable(e.target.checked)}
				/>
			</Td>
			<Td>
				<Text>{data.title}</Text>
			</Td>
			<Td>
				<Badge bg="green.200" color="black" fontSize="10px" ml="2" mt="-2">
					{getSchemeTypeLabel(data)}
				</Badge>
			</Td>
			<Td>
				<Text>{getExtraData(data)}</Text>
			</Td>
			<Td>
				<Stack direction="row" spacing="2" alignItems="center">
					<Avatar src={data.author?.avatar_url} size="xs" />
					<Text fontSize="xs" fontWeight="medium" color={authorColor}>
						{data.author?.display_name}
					</Text>
				</Stack>
			</Td>
			<Td>
				<ButtonGroup>
					<RouterLink
						to={routes.urlSchemes.edit.replace(
							':urlSchemId',
							data.id.toString()
						)}>
						<Button leftIcon={<BiEdit />} colorScheme="green" size="xs">
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
