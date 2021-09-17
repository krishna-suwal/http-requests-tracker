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
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Header from '../../components/common/Header';
import routes from '../../constants/routes';
import { predefinedSchemeTypes, urlSchemeTypes } from './data';

interface Props {
	onSubmit: any;
}

const AddNewUrlScheme: React.FC<Props> = (props) => {
	const { onSubmit } = props;
	const history = useHistory();
	const methods = useForm();
	const {
		register,
		formState: { errors },
		watch,
	} = methods;
	const schemeType = watch('type');

	return (
		<Stack direction="column" spacing="8" alignItems="center">
			<Header />
			<Container maxW="container.xl">
				<Stack direction="column" spacing="8">
					<Heading as="h1" size="xl">
						{__('Add New Scheme', 'hrt')}
					</Heading>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<Stack
							direction="column"
							spacing="8"
							bg="white"
							p="10"
							shadow="box">
							<FormControl display="flex" alignItems="center">
								<FormLabel mb="0">{__('Enable', 'hrt')}</FormLabel>
								<Switch defaultChecked={true} {...register('enable')} />
							</FormControl>

							<FormControl isInvalid={!!errors?.title}>
								<FormLabel>{__('Title', 'hrt')}</FormLabel>
								<Input
									defaultValue={__('Untitled', 'hrt')}
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
									<Input type="regex" {...register('regex')} />
									<FormErrorMessage>
										{errors?.regex && errors?.regex?.message}
									</FormErrorMessage>
								</FormControl>
							)}

							{schemeType === 'predefined' && (
								<FormControl isInvalid={!!errors?.predefined_type}>
									<FormLabel>{__('Predefined Type', 'hrt')}</FormLabel>
									<Select
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
								<Button colorScheme="blue" type="submit">
									{__('Add', 'hrt')}
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
				</Stack>
			</Container>
		</Stack>
	);
};

export default AddNewUrlScheme;
