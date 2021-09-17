import {
	Button,
	ButtonGroup,
	Container,
	Divider,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Input,
	Select,
	Stack,
	Switch,
	Text,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import routes from '../../constants/routes';
import { UrlSchemeType } from '../../types';
import { predefinedSchemeTypes, urlSchemeTypes } from './data';

interface Props {
	list: Array<UrlSchemeType>;
	onSubmit: any;
}

const EditUrlScheme: React.FC<Props> = (props) => {
	const { list, onSubmit } = props;
	const history = useHistory();
	const methods = useForm();
	const {
		register,
		watch,
		formState: { errors },
	} = methods;
	const { urlSchemId }: any = useParams();
	const data = list.find((item) => item.id + '' === urlSchemId + '');
	const callSubmit = (newData: {}) => {
		if (!data) return;

		onSubmit({
			...newData,
			id: data?.id,
		});
	};
	const schemeType = watch('type', data?.type);

	return (
		<Stack direction="column" spacing="8" alignItems="center">
			<Header>
				<Heading fontSize="md" fontWeight="bold" color="gray.500">
					{__('Edit Scheme', 'hrt')}
				</Heading>
			</Header>
			<Container maxW="container.xl">
				{data && (
					<form onSubmit={methods.handleSubmit(callSubmit)}>
						<Stack
							direction="column"
							spacing="8"
							bg="white"
							p="10"
							shadow="box">
							<FormControl display="flex" alignItems="center">
								<FormLabel mb="0">{__('Enable', 'hrt')}</FormLabel>
								<Switch defaultChecked={data.enable} {...register('enable')} />
							</FormControl>

							<FormControl isInvalid={!!errors?.title}>
								<FormLabel>{__('Title', 'hrt')}</FormLabel>
								<Input
									defaultValue={data.title}
									placeholder={__('Title', 'hrt')}
									{...register('title')}
								/>
								<FormErrorMessage>
									{errors?.title && errors?.title?.message}
								</FormErrorMessage>
							</FormControl>

							<FormControl isInvalid={!!errors?.type}>
								<FormLabel>{__('Type', 'hrt')}</FormLabel>
								<Select
									defaultValue={data.type}
									placeholder={__('Please select a type', 'hrt')}
									{...register('type', {
										required: __('Please select a type', 'hrt'),
									})}>
									{urlSchemeTypes.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</Select>
								<FormErrorMessage>
									{errors?.type && errors?.type?.message}
								</FormErrorMessage>
							</FormControl>

							{['absolute', 'relative'].includes(schemeType) && (
								<FormControl isInvalid={!!errors?.url}>
									<FormLabel>{__('URL', 'hrt')}</FormLabel>
									<Input
										defaultValue={data?.url}
										placeholder={__('Absolute URL', 'hrt')}
										{...register('url')}
									/>
									<FormErrorMessage>
										{errors?.url && errors?.url?.message}
									</FormErrorMessage>
								</FormControl>
							)}

							{schemeType === 'regex' && (
								<FormControl isInvalid={!!errors?.regex}>
									<FormLabel>{__('Pattern', 'hrt')}</FormLabel>
									<Input
										defaultValue={data?.regex}
										type="regex"
										{...register('regex')}
									/>
									<FormErrorMessage>
										{errors?.regex && errors?.regex?.message}
									</FormErrorMessage>
								</FormControl>
							)}

							{schemeType === 'predefined' && (
								<FormControl isInvalid={!!errors?.predefined_type}>
									<FormLabel>{__('Predefined Type', 'hrt')}</FormLabel>
									<Select
										defaultValue={data?.predefined_type}
										placeholder={__('Please select a type', 'hrt')}
										{...register('predefined_type', {
											required: __('Please select a type', 'hrt'),
										})}>
										{predefinedSchemeTypes.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</Select>
									<FormErrorMessage>
										{errors?.predefined_type &&
											errors?.predefined_type?.message}
									</FormErrorMessage>
								</FormControl>
							)}

							<Divider />
							<ButtonGroup>
								<Button colorScheme="green" type="submit">
									{__('Update', 'hrt')}
								</Button>
								<Button
									variant="outline"
									onClick={() =>
										history.push({
											pathname: routes.urlSchemes.list,
										})
									}>
									{__('Cancel', 'hrt')}
								</Button>
							</ButtonGroup>
						</Stack>
					</form>
				)}
				{!data && (
					<Text fontSize="xs" fontWeight="medium" color="gray.600">
						{__('Data not found!', 'hrt')}
					</Text>
				)}
			</Container>
		</Stack>
	);
};

export default EditUrlScheme;
