import {
	Button,
	ButtonGroup,
	IconButton,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Td,
	Tr,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { BiDotsVerticalRounded, BiEdit, BiShow, BiTrash } from 'react-icons/bi';
import { Link as RouterLink } from 'react-router-dom';
import routes from '../../../constants/routes';

interface Props {
	id: number;
	name: string;
	description: string;
	slug: string;
	count: Number;
	link: string;
	onDeletePress: any;
}

const CategoryRow: React.FC<Props> = (props) => {
	const { id, name, description, slug, count, link, onDeletePress } = props;

	return (
		<Tr>
			<Td>
				<Link
					as={RouterLink}
					to={routes.course_categories.edit.replace(
						':categoryId',
						id.toString()
					)}
					fontWeight="semibold"
					_hover={{ color: 'blue.500' }}>
					{name}
				</Link>
			</Td>
			<Td
				dangerouslySetInnerHTML={{ __html: description ? description : '—' }}
			/>
			<Td>{slug}</Td>
			<Td>
				<Link href={link} isExternal>
					{count}
				</Link>
			</Td>
			<Td>
				<ButtonGroup>
					<RouterLink
						to={routes.course_categories.edit.replace(
							':categoryId',
							id.toString()
						)}>
						<Button leftIcon={<BiEdit />} colorScheme="blue" size="xs">
							{__('Edit')}
						</Button>
					</RouterLink>
					<Menu placement="bottom-end">
						<MenuButton
							as={IconButton}
							icon={<BiDotsVerticalRounded />}
							variant="outline"
							rounded="sm"
							fontSize="large"
							size="xs"
						/>
						<MenuList>
							<Link href={link} isExternal>
								<MenuItem icon={<BiShow />}>
									{__('View Category', 'masteriyo')}
								</MenuItem>
							</Link>
							<MenuItem onClick={() => onDeletePress(id)} icon={<BiTrash />}>
								{__('Delete', 'masteriyo')}
							</MenuItem>
						</MenuList>
					</Menu>
				</ButtonGroup>
			</Td>
		</Tr>
	);
};

export default CategoryRow;
