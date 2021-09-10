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
import React from 'react';
import { BiPlus } from 'react-icons/bi';
import { useHistory } from 'react-router-dom';
import Header from '../../components/common/Header';
import { tableStyles } from '../../config/styles';
import routes from '../../constants/routes';
import { UrlSchemeType } from '../../types';
import UrlSchemItem from './components/UrlSchemItem';

interface Props {
	items: Array<UrlSchemeType>;
	onClickRemoveItem: Function;
}

const UrlSchemesList: React.FC<Props> = (props) => {
	const { items, onClickRemoveItem } = props;
	const history = useHistory();
	const cancelRef = React.useRef<any>();

	const { onClose, onOpen, isOpen } = useDisclosure();

	return (
		<Stack direction="column" spacing="8" alignItems="center">
			<Header
				thirdBtn={{
					label: __('Add URL Scheme', 'masteriyo'),
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
										<Th>{__('Title', 'masteriyo')}</Th>
										<Th>{__('Type', 'masteriyo')}</Th>
										<Th>{__('Author', 'masteriyo')}</Th>
										<Th>{__('Actions', 'masteriyo')}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{items.map((item: any, index: number) => (
										<UrlSchemItem
											key={item.id}
											id={item.id}
											title={item.title}
											type={item.type}
											author={item.author}
											onClickDelete={() => onClickRemoveItem(index)}
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
							{__('Deleting Course')} {name}
						</AlertDialogHeader>
						<AlertDialogBody>
							{__("Are you sure? You can't restore this back", 'masteriyo')}
						</AlertDialogBody>
						<AlertDialogFooter>
							<ButtonGroup>
								<Button onClick={onClose} variant="outline" ref={cancelRef}>
									{__('Cancel', 'masteriyo')}
								</Button>
								{/* <Button
									colorScheme="red"
									isLoading={deleteCourse.isLoading}
									onClick={onDeleteCofirm}>
									{__('Delete', 'masteriyo')}
								</Button> */}
							</ButtonGroup>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Stack>
	);
};

export default UrlSchemesList;
