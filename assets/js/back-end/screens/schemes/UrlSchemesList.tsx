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
	Heading,
	Icon,
	Stack,
	Table,
	Tbody,
	Th,
	Thead,
	Tr,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { useHistory } from 'react-router-dom';
import Header from '../../components/common/Header';
import { tableStyles } from '../../config/styles';
import routes from '../../constants/routes';
import { UrlSchemeType } from '../../types';
import EmptyInfo from './components/EmptyInfo';
import UrlSchemeItem from './components/UrlSchemeItem';

interface Props {
	items: Array<UrlSchemeType>;
	onClickRemoveItem: Function;
	onChangeEnable: any;
}

const UrlSchemesList: React.FC<Props> = (props) => {
	const { items, onClickRemoveItem, onChangeEnable } = props;
	const history = useHistory();
	const cancelRef = React.useRef<any>();
	const tableBorderColor = useColorModeValue('gray.100', 'gray.700');
	const { onClose, onOpen, isOpen } = useDisclosure();
	const [deleteItemId, setDeleteItemId] = useState<number>();
	const onDeletePress = (index: number) => {
		onOpen();
		setDeleteItemId(index);
	};
	const onDeleteCofirm = () => {
		onClickRemoveItem(deleteItemId);
		onClose();
	};

	return (
		<Stack direction="column" alignItems="center">
			<Header
				primaryBtn={{
					label: __('Add Scheme', 'hrt'),
					action: () => history.push(routes.urlSchemes.add),
					icon: <Icon as={BiPlus} fontSize="md" />,
				}}>
				<Heading fontSize="md" fontWeight="bold" color="gray.500">
					{__('Schemes', 'hrt')}
				</Heading>
			</Header>
			<Container maxW="container.xl" py="4">
				<Box
					border="1px"
					borderColor={tableBorderColor}
					borderRadius="md"
					py="8">
					<Table size="sm" sx={tableStyles} variant="striped">
						<Thead>
							<Tr>
								<Th></Th>
								<Th>{__('Title', 'hrt')}</Th>
								<Th>{__('Type', 'hrt')}</Th>
								<Th>{__('Relative Data', 'hrt')}</Th>
								<Th>{__('Author', 'hrt')}</Th>
								<Th>{__('Actions', 'hrt')}</Th>
							</Tr>
						</Thead>
						<Tbody>
							{items.length === 0 ? (
								<EmptyInfo message={__('Nothing found.', 'hrt')} />
							) : (
								items.map((item: any) => (
									<UrlSchemeItem
										key={item.id}
										data={item}
										onClickDelete={() => onDeletePress(item.id)}
										onChangeEnable={(isChecked: boolean) =>
											onChangeEnable(item.id, isChecked)
										}
									/>
								))
							)}
						</Tbody>
					</Table>
				</Box>
			</Container>
			<AlertDialog
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				leastDestructiveRef={cancelRef}>
				<AlertDialogOverlay>
					<AlertDialogContent borderRadius="0">
						<AlertDialogHeader>
							{__('Deleting Scheme')} {name}
						</AlertDialogHeader>
						<AlertDialogBody>
							{__("Are you sure? You can't restore this back", 'hrt')}
						</AlertDialogBody>
						<AlertDialogFooter>
							<ButtonGroup>
								<Button onClick={onClose} variant="outline" ref={cancelRef}>
									{__('Cancel', 'hrt')}
								</Button>
								<Button colorScheme="red" onClick={onDeleteCofirm}>
									{__('Delete', 'hrt')}
								</Button>
							</ButtonGroup>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Stack>
	);
};

export default UrlSchemesList;
