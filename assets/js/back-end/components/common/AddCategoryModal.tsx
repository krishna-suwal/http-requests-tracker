import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import urls from '../../constants/urls';
import { CreateCatModal } from '../../context/CreateCatProvider';
import DescriptionInput from '../../screens/course-categories/components/DescriptionInput';
import NameInput from '../../screens/course-categories/components/NameInput';
import SlugInput from '../../screens/course-categories/components/SlugInput';
import API from '../../utils/api';
import { deepClean } from '../../utils/utils';

interface AddCatData {
	name: string;
	slug: string;
	description: string;
}

const AddCategoryModal = () => {
	const { isCreateCatModalOpen, setIsCreateCatModalOpen } =
		useContext(CreateCatModal);
	const methods = useForm();
	const categoryAPI = new API(urls.categories);
	const toast = useToast();
	const queryClient = useQueryClient();

	const createCategory = useMutation(
		(data: object) => categoryAPI.store(data),
		{
			onSuccess: () => {
				toast({
					title: __('Category Added', 'masteriyo'),
					description: __(
						'You can select the new category form dropdown',
						'masteriyo'
					),
					isClosable: true,
					status: 'success',
				});
				queryClient.invalidateQueries('categoryLists');
				setIsCreateCatModalOpen(false);
				methods.reset();
			},
			onError: (error: any) => {
				toast({
					title: __('Failed to create category', 'masteriyo'),
					description: `${error.response?.data?.message}`,
					isClosable: true,
					status: 'error',
				});
			},
		}
	);

	const onSubmit = (data: AddCatData) => {
		createCategory.mutate(deepClean(data));
	};

	return (
		<Modal
			isOpen={isCreateCatModalOpen}
			onClose={() => setIsCreateCatModalOpen(false)}
			size="2xl"
			isCentered>
			<ModalOverlay />
			<ModalContent>
				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<ModalHeader>{__('Add new category', 'masteriyo')}</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Stack direction="column" spacing="4">
								<NameInput />
								<SlugInput />
								<DescriptionInput />
							</Stack>
						</ModalBody>

						<ModalFooter>
							<Button
								colorScheme="blue"
								type="submit"
								isFullWidth
								isLoading={createCategory.isLoading}>
								{__('Add new Category', 'masteriyo')}
							</Button>
						</ModalFooter>
					</form>
				</FormProvider>
			</ModalContent>
		</Modal>
	);
};

export default AddCategoryModal;
