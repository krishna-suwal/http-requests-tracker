import {
	Box,
	Button,
	ButtonGroup,
	Center,
	Icon,
	Image,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Progress,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BiCheck } from 'react-icons/bi';
import { useMutation, useQuery } from 'react-query';
import { MediaSchema } from '../../schemas';
import MediaAPI from '../../utils/media';

interface Props {
	isOpen: boolean;
	onClose: any;
	onComplete?: any;
	get?: 'id' | 'url';
	selected?: number;
	title?: string;
	addButtonText?: string;
}

const ImageUploadModal: React.FC<Props> = (props) => {
	const { isOpen, onClose, onComplete, get, selected, title, addButtonText } =
		props;
	const toast = useToast();
	const imageAPi = new MediaAPI();
	const [selectedImage, setSelectedImage] = useState<any>(selected);
	const [imageUrl, setImageUrl] = useState<any>(null);
	const [tabIndex, setTabIndex] = useState(0);

	const imagesQuery = useQuery('medias', () => imageAPi.list());
	const uploadMedia = useMutation((image: any) => imageAPi.store(image));

	const onUpload = (file: any) => {
		let formData = new FormData();
		formData.append('file', file);

		uploadMedia.mutate(formData, {
			onSuccess: (data: MediaSchema) => {
				imagesQuery.refetch();
				setTabIndex(1);
				setSelectedImage(data.id);
				setImageUrl(data.source_url);
			},
		});
	};

	const onDrop = (acceptedFiles: any) => {
		if (acceptedFiles.length) {
			onUpload(acceptedFiles[0]);
		} else {
			toast({
				title: __('Please upload Valid Image files', 'masteriyo'),
				description: __(
					'Media files jpeg, png are only supported',
					'masteriyo'
				),
				status: 'error',
				isClosable: true,
			});
			return;
		}
	};

	const { getRootProps, getInputProps, isDragAccept, isDragReject } =
		useDropzone({
			accept: 'image/jpeg, image/png',
			onDrop: onDrop,
		});

	return (
		<Modal
			size="fullSpacing"
			isOpen={isOpen}
			onClose={onClose}
			isCentered
			closeOnEsc={false}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader
					bg="gray.800"
					borderTopRightRadius="xs"
					borderTopLeftRadius="xs"
					color="white"
					fontSize="sm">
					{title || __('Media Manager', 'masteriyo')}
				</ModalHeader>
				<ModalCloseButton color="white" />
				<ModalBody py="6" p="0">
					<Tabs onChange={(index) => setTabIndex(index)} index={tabIndex}>
						<TabList>
							<Tab fontSize="sm" px="0" py="3" mx="4">
								{__('Upload files')}
							</Tab>
							<Tab fontSize="sm" px="0" py="3" mx="4">
								{__('Media Library')}
							</Tab>
						</TabList>
						<TabPanels flex="1">
							<TabPanel>
								<Center
									bg={
										isDragAccept
											? 'green.50'
											: isDragReject
											? 'red.50'
											: '#f8f8f8'
									}
									border="2px dashed"
									borderColor="gray.200"
									borderRadius="sm"
									transition="ease-in-out"
									textAlign="center"
									position="relative"
									h="180px"
									{...getRootProps()}>
									<input {...getInputProps()} multiple={false} />

									{uploadMedia.isLoading ? (
										<Progress hasStripe size="xs" />
									) : (
										<Stack direction="column">
											<Text>{__('Drop Files To Upload', 'masteriyo')}</Text>
											<Text fontSize="xs">{__('Or', 'masteriyo')}</Text>
											<Button variant="outline" colorScheme="blue">
												{__('Select Files', 'masteriyo')}
											</Button>
										</Stack>
									)}
								</Center>
							</TabPanel>
							<TabPanel>
								{imagesQuery.isSuccess && (
									<Stack direction="row" flexWrap="wrap" spacing="2">
										{imagesQuery.data.map((image: MediaSchema) => {
											if (image.media_type === 'image') {
												return (
													<Box
														key={image.id}
														w="100px"
														h="100px"
														position="relative">
														<Image
															border="3px solid"
															cursor="pointer"
															borderColor={
																selectedImage === image.id
																	? 'blue.500'
																	: 'transparent'
															}
															onClick={() => {
																setSelectedImage(image.id);
																setImageUrl(image.source_url);
															}}
															src={image.source_url}
															objectFit="cover"
															h="full"
															w="full"
														/>
														{selectedImage === image.id && (
															<Icon
																as={BiCheck}
																pos="absolute"
																right="0"
																top="0"
																fontSize="xl"
																color="white"
																shadow="md"
																bg="blue.500"
															/>
														)}
													</Box>
												);
											}
										})}
									</Stack>
								)}
							</TabPanel>
						</TabPanels>
					</Tabs>
				</ModalBody>
				<ModalFooter bg="gray.50" borderTop="1px" borderColor="gray.100">
					<ButtonGroup>
						<Button
							colorScheme="blue"
							onClick={() => {
								onComplete(get === 'url' ? imageUrl : selectedImage);
							}}>
							{addButtonText || __('Add Image', 'masteriyo')}
						</Button>
						<Button variant="outline" onClick={onClose}>
							{__('Cancel', 'masteriyo')}
						</Button>
					</ButtonGroup>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default ImageUploadModal;
