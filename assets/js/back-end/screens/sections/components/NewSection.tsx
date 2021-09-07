import {
	Box,
	Button,
	ButtonGroup,
	Divider,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Stack,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import Editor from '../../../components/common/Editor';
import urls from '../../../constants/urls';
import { SectionSchema } from '../../../schemas';
import API from '../../../utils/api';
import { deepClean, deepMerge } from '../../../utils/utils';

export interface NewSectionProps {
	onSave: () => void;
	onCancel: () => void;
	courseId: number;
}

type SectionInputs = {
	name?: string;
	description?: string;
};

const NewSection: React.FC<NewSectionProps> = (props) => {
	const { onSave, onCancel, courseId } = props;
	const methods = useForm<SectionInputs>();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = methods;
	const queryClient = useQueryClient();
	const sectionAPI = new API(urls.sections);

	const addSection = useMutation((data: any) => sectionAPI.store(data), {
		onSuccess: () => {
			queryClient.invalidateQueries(`builder${courseId}`);
			reset();
			onSave();
		},
	});

	const onSubmit = (data: SectionSchema) => {
		const cleanData = deepClean(data);
		const newData = {
			parent_id: courseId,
			course_id: courseId,
		};
		addSection.mutate(deepMerge(cleanData, newData));
	};

	return (
		<Box p="8" bg="white" shadow="box" mb="8">
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Stack direction="column" spacing="8">
						<FormControl isInvalid={!!errors?.name}>
							<FormLabel htmlFor="">
								{__('Section Name', 'masteriyo')}
							</FormLabel>
							<Input
								placeholder={__('Your Section Name', 'masteriyo')}
								{...register('name', {
									required: __('Section name cannot be empty', 'masteriyo'),
								})}></Input>
							{errors?.name && (
								<FormErrorMessage>{errors?.name.message}</FormErrorMessage>
							)}
						</FormControl>
						<FormControl>
							<FormLabel htmlFor="">
								{__('Section Description', 'masteriyo')}
							</FormLabel>
							<Editor name="description" willReset size="md" />
						</FormControl>
						<Divider />
						<ButtonGroup>
							<Button
								colorScheme="blue"
								type="submit"
								isLoading={addSection.isLoading}>
								{__('Add', 'masteriyo')}
							</Button>
							{!addSection.isLoading && (
								<Button variant="outline" onClick={() => onCancel()}>
									{__('Cancel', 'masteriyo')}
								</Button>
							)}
						</ButtonGroup>
					</Stack>
				</form>
			</FormProvider>
		</Box>
	);
};

export default NewSection;
