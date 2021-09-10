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
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { tableStyles } from '../../config/styles';
import { LogType } from '../../types';
import LogItem from './components/LogItem';

interface Props {
	items: Array<LogType>;
	onClickRemoveItem: Function;
}

const Logs: React.FC<Props> = (props) => {
	const { items, onClickRemoveItem } = props;
	const history = useHistory();
	const cancelRef = React.useRef<any>();

	const { onClose, onOpen, isOpen } = useDisclosure();

	return (
		<>
			<Container maxW="container.xl">
				<Box bg="white" py="12" shadow="box" mx="auto">
					<Stack direction="column" spacing="10">
						<Stack direction="column" spacing="8">
							<Table size="sm" sx={tableStyles}>
								<Thead>
									<Tr>
										<Th>{__('Title', 'hrt')}</Th>
										<Th>{__('Description', 'hrt')}</Th>
										<Th>{__('Type', 'hrt')}</Th>
										<Th>{__('Author', 'hrt')}</Th>
										<Th>{__('Actions', 'hrt')}</Th>
									</Tr>
								</Thead>
								<Tbody>
									{items.map((item: any, index: number) => (
										<LogItem
											key={item.id}
											data={item}
											onClickDelete={() => onClickRemoveItem(index)}
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
