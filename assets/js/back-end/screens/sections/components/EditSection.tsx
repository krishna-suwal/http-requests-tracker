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
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import Editor from '../../../components/common/Editor';
import urls from '../../../constants/urls';
import { SectionSchema } from '../../../schemas';
import API from '../../../utils/api';
import { deepClean } from '../../../utils/utils';

export interface EditSectionProps {
	id: number;
	name: string;
	description?: string;
	onSave: () => void;
	onCancel: () => void;
	courseId: number;
}

type SectionInputs = {
	name?: string;
	description?: string;
};

const EditSection: React.FC<EditSectionProps> = (props) => {
	const { id, name, description, onSave, onCancel, courseId } = props;
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SectionInputs>();
	const queryClient = useQueryClient();
	const toast = useToast();
	const sectionAPI = new API(urls.sections);

	const updateMutation = useMutation(
		(data: SectionSchema) => sectionAPI.update(id, data),
		{
			onSuccess: (data: any) => {
				toast({
					title: __('Updated Successfully', 'masteriyo'),
					description: data.name + __(' is updated succesffuly', 'masteriyo'),
					status: 'success',
					isClosable: true,
				});
				queryClient.invalidateQueries(`builder${courseId}`);
				onSave();
			},
		}
	);

	const onUpdate = (data: SectionSchema) => {
		updateMutation.mutate(deepClean(data));
	};

	return (
		<Box p="5" pt="0">
			<form onSubmit={handleSubmit(onUpdate)}>
				<Stack direction="column" spacing="8">
					<FormControl isInvalid={!!errors?.name}>
						<FormLabel htmlFor="">{__('Section Name', 'masteriyo')}</FormLabel>
						<Input
							placeholder={__('Your Section Name', 'masteriyo')}
							defaultValue={name}
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
						<Editor name="description" defaultValue={description} size="md" />
					</FormControl>
					<Divider />
					<ButtonGroup>
						<Button colorScheme="blue" type="submit">
							{__('Save', 'masteriyo')}
						</Button>
						<Button variant="outline" onClick={() => onCancel()}>
							{__('Cancel', 'masteriyo')}
						</Button>
					</ButtonGroup>
					<Divider />
				</Stack>
			</form>
		</Box>
	);
};

export default EditSection;
