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
	useColorModeValue,
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
	const borderColor = useColorModeValue('gray.100', 'gray.700');
	const history = useHistory();
	const methods = useForm();
	const {
		register,
		formState: { errors },
		watch,
	} = methods;
	const schemeType = watch('type');

	return (
		<Stack direction="column" spacing="6" alignItems="center">
			<Header>
				<Heading fontSize="md" fontWeight="bold" color="gray.500">
					{__('Add Scheme', 'hrt')}
				</Heading>
			</Header>
			<Container maxW="container.xl">
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<Stack
						direction="column"
						spacing="8"
						border="1px"
						borderColor={borderColor}
						borderRadius="md"
						p="8">
						<FormControl
							display="flex"
							alignItems="center"
							maxW="sm"
							justifyContent="space-between">
							<FormLabel mb="0">{__('Enable', 'hrt')}</FormLabel>
							<Switch
								colorScheme="green"
								defaultChecked={true}
								{...register('enable')}
							/>
						</FormControl>

						<FormControl isInvalid={!!errors?.title}>
							<FormLabel>{__('Title', 'hrt')}</FormLabel>
							<Input
								size="sm"
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
								size="sm"
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
									size="sm"
								/>
								<FormErrorMessage>
									{errors?.url && errors?.url?.message}
								</FormErrorMessage>
							</FormControl>
						)}

						{schemeType === 'regex' && (
							<FormControl isInvalid={!!errors?.regex}>
								<FormLabel>{__('Pattern', 'hrt')}</FormLabel>
								<Input size="sm" type="regex" {...register('regex')} />
								<FormErrorMessage>
									{errors?.regex && errors?.regex?.message}
								</FormErrorMessage>
							</FormControl>
						)}

						{schemeType === 'predefined' && (
							<FormControl isInvalid={!!errors?.predefined_type}>
								<FormLabel>{__('Predefined Type', 'hrt')}</FormLabel>
								<Select
									size="sm"
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
									{errors?.predefined_type && errors?.predefined_type?.message}
								</FormErrorMessage>
							</FormControl>
						)}

						<Divider />
						<ButtonGroup>
							<Button
								size="sm"
								colorScheme="green"
								type="submit"
								borderRadius="3xl"
								px="6">
								{__('Add', 'hrt')}
							</Button>
							<Button
								size="sm"
								variant="outline"
								borderRadius="3xl"
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
			</Container>
		</Stack>
	);
};

export default AddNewUrlScheme;
