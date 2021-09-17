import {
	Box,
	Button,
	Collapse,
	Flex,
	IconButton,
	Select,
	Stack,
	useMediaQuery,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { deepClean } from '../../../utils/utils';
import { logFilterTypes } from '../data';

interface FilterParams {
	type?: string;
	user_id?: string | number;
	per_page?: number;
	page?: number;
}

interface Props {
	filterParams: FilterParams;
	setFilterParams: any;
	users?: { id: number; display_name: string; avatar_url: string }[];
}

const LogsFilter: React.FC<Props> = (props) => {
	const { filterParams, setFilterParams, users = [] } = props;
	const { handleSubmit, register } = useForm();
	const [isMobile] = useMediaQuery('(min-width: 48em)');
	const [isOpen, setIsOpen] = useState(isMobile);

	const onSubmit = (data: FilterParams) => {
		setFilterParams(deepClean(data));
	};

	useEffect(() => {
		setIsOpen(isMobile);
	}, [isMobile]);

	return (
		<Box px={{ base: 6, md: 12 }}>
			<Flex justify="end">
				{!isMobile && (
					<IconButton
						icon={<BiDotsVerticalRounded />}
						variant="outline"
						rounded="sm"
						fontSize="large"
						aria-label={__('toggle filter')}
						onClick={() => setIsOpen(!isOpen)}
					/>
				)}
			</Flex>
			<Collapse in={isOpen}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack
						direction={['column', null, 'row']}
						spacing="4"
						mt={[6, null, 0]}>
						<Select
							size="sm"
							w="auto"
							{...register('type')}
							defaultValue={filterParams?.type}
							placeholder={__('All Types', 'hrt')}>
							{logFilterTypes.map((option: any) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</Select>

						<Select
							size="sm"
							w="auto"
							{...register('user_id')}
							defaultValue={filterParams?.user_id}
							placeholder={__('All Users', 'hrt')}>
							{users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.display_name}
								</option>
							))}
						</Select>

						<Button
							colorScheme="green"
							type="submit"
							size="sm"
							borderRadius="3xl"
							px="6">
							{__('Filter', 'hrt')}
						</Button>
					</Stack>
				</form>
			</Collapse>
		</Box>
	);
};

export default LogsFilter;
