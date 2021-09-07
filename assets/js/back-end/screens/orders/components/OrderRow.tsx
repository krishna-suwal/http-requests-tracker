import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Badge,
	Button,
	ButtonGroup,
	Icon,
	IconButton,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Stack,
	Td,
	Text,
	Tr,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useRef, useState } from 'react';
import {
	BiCalendar,
	BiDotsVerticalRounded,
	BiEdit,
	BiShow,
	BiTrash,
} from 'react-icons/bi';
import { useMutation, useQueryClient } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import PriceWithSymbol from '../../../components/common/PriceWithSymbol';
import routes from '../../../constants/routes';
import urls from '../../../constants/urls';
import API from '../../../utils/api';
import { getLocalTime } from '../../../utils/utils';

const makeOrderNumberLabel = (order: any) => {
	if (order.billing.first_name || order.billing.last_name) {
		return `#${order.id} ${order.billing.first_name} ${order.billing.last_name}`.trim();
	} else if (order.billing.company) {
		return `#${order.id} ${order.billing.company}`.trim();
	}
	return `#${order.id}`;
};

interface BillingAdress {
	first_name: string;
	last_name: string;
	company: string;
	address_1: string;
	address_2: string;
	city: string;
	state: string;
	postcode: string;
	country: string;
}
interface Order {
	id: number;
	order_number: string;
	date_created: string;
	status: any;
	total: string;
	currency_symbol: string;
	billing: BillingAdress;
}
interface Props {
	data: Order;
}

const OrderRow: React.FC<Props> = (props) => {
	const { data } = props;
	const { id, status, total, currency_symbol, billing } = data;
	const order_number = makeOrderNumberLabel(data);
	const queryClient = useQueryClient();
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isOrderPreviewModalOpen, setOrderPreviewModalOpen] = useState(false);
	const ordersAPI = new API(urls.orders);
	const cancelDeleteModalRef = useRef<any>();
	const cancelOrderPreviewModalRef = useRef<any>();

	const deleteOrder = useMutation((id: number) => ordersAPI.delete(id), {
		onSuccess: () => {
			setDeleteModalOpen(false);
			queryClient.invalidateQueries('ordersList');
		},
	});

	const onDeletePress = () => {
		setDeleteModalOpen(true);
	};
	const onDeleteModalClose = () => {
		setDeleteModalOpen(false);
	};
	const onDeleteConfirm = () => {
		deleteOrder.mutate(id);
	};

	const onPreviewPress = () => {
		setOrderPreviewModalOpen(true);
	};
	const onOrderPreviewModalClose = () => {
		setOrderPreviewModalOpen(false);
	};

	return (
		<Tr>
			<Td>
				<Link
					as={RouterLink}
					to={routes.orders.edit.replace(':orderId', id.toString())}
					fontWeight="semibold"
					_hover={{ color: 'blue.500' }}>
					{order_number}
				</Link>
			</Td>
			<Td>
				<Stack direction="row" spacing="2" alignItems="center" color="gray.600">
					<Icon as={BiCalendar} />
					<Text fontSize="sm" fontWeight="medium">
						{getLocalTime(data?.date_created).toLocaleString()}
					</Text>
				</Stack>
			</Td>
			<Td>
				<Badge>{status}</Badge>
			</Td>
			<Td>{PriceWithSymbol(total, currency_symbol)}</Td>
			<Td>
				<ButtonGroup>
					<RouterLink
						to={routes.orders.edit.replace(':orderId', id.toString())}>
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
							<MenuItem onClick={onPreviewPress} icon={<BiShow />}>
								{__('Preview', 'masteriyo')}
							</MenuItem>
							<MenuItem onClick={onDeletePress} icon={<BiTrash />}>
								{__('Delete', 'masteriyo')}
							</MenuItem>
						</MenuList>
					</Menu>
				</ButtonGroup>

				{/* Order Preview Dialog */}
				<AlertDialog
					isOpen={isOrderPreviewModalOpen}
					onClose={onOrderPreviewModalClose}
					isCentered
					leastDestructiveRef={cancelOrderPreviewModalRef}>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader>
								{__('Order', 'masteriyo')} {order_number}
							</AlertDialogHeader>
							<AlertDialogBody>
								<div>
									<strong>{__('Billing details', 'masteriyo')}</strong>
								</div>
								<div>
									{billing.first_name} {billing.last_name}
								</div>
								<div>{billing.company}</div>
								<div>{billing.address_1}</div>
								<div>{billing.address_2}</div>
								<div>{billing.city}</div>
								<div>{billing.state}</div>
								<div>{billing.postcode}</div>
								<div>{billing.country}</div>
							</AlertDialogBody>
							<AlertDialogFooter>
								<ButtonGroup>
									<Button
										ref={cancelOrderPreviewModalRef}
										onClick={onOrderPreviewModalClose}
										variant="outline">
										{__('OK', 'masteriyo')}
									</Button>
									<Link
										as={RouterLink}
										to={routes.orders.edit.replace(':orderId', id.toString())}>
										<Button colorScheme="blue">
											{__('Edit', 'masteriyo')}
										</Button>
									</Link>
								</ButtonGroup>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</AlertDialog>

				{/* Delete Order Dialog */}
				<AlertDialog
					isOpen={isDeleteModalOpen}
					onClose={onDeleteModalClose}
					isCentered
					leastDestructiveRef={cancelDeleteModalRef}>
					<AlertDialogOverlay>
						<AlertDialogContent>
							<AlertDialogHeader>
								{__('Delete Order')} {order_number}
							</AlertDialogHeader>
							<AlertDialogBody>
								{__("Are you sure? You can't restore this order.", 'masteriyo')}
							</AlertDialogBody>
							<AlertDialogFooter>
								<ButtonGroup>
									<Button
										ref={cancelDeleteModalRef}
										onClick={onDeleteModalClose}
										variant="outline">
										{__('Cancel', 'masteriyo')}
									</Button>
									<Button
										colorScheme="red"
										onClick={onDeleteConfirm}
										isLoading={deleteOrder.isLoading}>
										{__('Delete', 'masteriyo')}
									</Button>
								</ButtonGroup>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialogOverlay>
				</AlertDialog>
			</Td>
		</Tr>
	);
};

export default OrderRow;
