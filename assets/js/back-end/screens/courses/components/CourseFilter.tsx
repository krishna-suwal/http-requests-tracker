import { Box, Input, Select, Stack } from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useOnType } from 'use-ontype';
import urls from '../../../constants/urls';
import API from '../../../utils/api';
import { deepClean } from '../../../utils/utils';

const courseStatusList = [
	{
		label: __('All', 'masteriyo'),
		value: '',
	},
	{
		label: __('Published', 'masteriyo'),
		value: 'publish',
	},
	{
		label: __('Draft', 'masteriyo'),
		value: 'draft',
	},
];

interface FilterParams {
	category?: string | number;
	search?: string;
	status?: string;
	price_type?: string;
}

interface Props {
	setFilterParams: any;
}

const CourseFilter: React.FC<Props> = (props) => {
	const { setFilterParams } = props;
	const categoryAPI = new API(urls.categories);
	const categoryQuery = useQuery('categoryLists', () => categoryAPI.list(), {
		retry: false,
	});
	const { handleSubmit, register, setValue } = useForm();
	const onSearchInput = useOnType(
		{
			onTypeFinish: (val: string) => {
				setFilterParams({
					search: val,
				});
				setValue('category', '');
				setValue('status', '');
				setValue('price', '');
			},
		},
		800
	);

	const onChange = (data: FilterParams) => {
		setFilterParams(deepClean(data));
	};

	return (
		<Box px="12">
			<form onChange={handleSubmit(onChange)}>
				<Stack direction="row" spacing="4">
					<Input
						placeholder={__('Search courses', 'masteriyo')}
						{...onSearchInput}
					/>
					<Select {...register('category')}>
						<option value="">{__('All Categories', 'masteriyo')}</option>
						{categoryQuery.isSuccess &&
							categoryQuery?.data?.map(
								(category: { id: number; name: string }) => (
									<option key={category.id} value={category.id}>
										{category.name}
									</option>
								)
							)}
					</Select>

					<Select {...register('status')}>
						{courseStatusList.map((option: any) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</Select>

					<Select {...register('price_type')}>
						<option value="">{__('Pricing', 'masteriyo')}</option>
						<option value="free">{__('Free', 'masteriyo')}</option>
						<option value="paid">{__('Paid', 'masteriyo')}</option>
					</Select>
				</Stack>
			</form>
		</Box>
	);
};

export default CourseFilter;
