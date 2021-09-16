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
	Icon,
	Stack,
	Table,
	Tbody,
	Th,
	Thead,
	Tr,
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
import UrlSchemeItem from './components/UrlSchemeItem';

interface Props {
	items: Array<UrlSchemeType>;
	onClickRemoveItem: Function;
}

const UrlSchemesList: React.FC<Props> = (props) => {
	const { items, onClickRemoveItem } = props;
	const history = useHistory();
	const cancelRef = React.useRef<any>();

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
		<Stack direction="column" spacing="8" alignItems="center">
			<Header
				primaryBtn={{
					label: __('Add URL Scheme', 'hrt'),
					action: () => history.push(routes.urlSchemes.add),
					icon: <Icon as={BiPlus} fontSize="md" />,
				}}></Header>
			<Container maxW="container.xl">
				<Box bg="white" py="12" shadow="box" mx="auto">
					<Stack direction="column" spacing="10">
						<Stack direction="column" spacing="8">
							<Table size="sm" sx={tableStyles}>
								<Thead>
									<Tr>
										<Th>{__('Title', 'hrt')}</Th>
										<Th>{__('Type', 'hrt')}</Th>
										<Th>{__('Author', 'hrt')}</Th>
										<Th>{__('Actions', 'hrt')}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{items.map((item: any) => (
										<UrlSchemeItem
											key={item.id}
											id={item.id}
											title={item.title}
											type={item.type}
											author={item.author}
											onClickDelete={() => onDeletePress(item.id)}
											onClickEdit={() => ''}
										/>
									))}
								</Tbody>
							</Table>
						</Stack>
					</Stack>
				</Box>
			</Container>
			<AlertDialog
				isOpen={isOpen}
				onClose={onClose}
				isCentered
				leastDestructiveRef={cancelRef}>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader>
							{__('Deleting Url Scheme')} {name}
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
