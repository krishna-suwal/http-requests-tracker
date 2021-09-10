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
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Header from '../../components/common/Header';
import routes from '../../constants/routes';

const urlSchemeTypes = [
	{
		value: 'regex',
		label: __('Regular Expression', 'hrt'),
	},
	{
		value: 'absolute',
		label: __('Absolute URL', 'hrt'),
	},
	{
		value: 'relative',
		label: __('Relative URL', 'hrt'),
	},
	{
		value: 'only_url_args',
		label: __('Only Url Args', 'hrt'),
	},
	{
		value: 'predefined',
		label: __('Predefined', 'hrt'),
	},
];

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
	} = methods;

	return (
		<Stack direction="column" spacing="8" alignItems="center">
			<Header />
			<Container maxW="container.xl">
				<Stack direction="column" spacing="8">
					<Heading as="h1" size="xl">
						{__('Add New URL Scheme', 'hrt')}
					</Heading>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						<Stack
							direction="column"
							spacing="8"
							bg="white"
							p="10"
							shadow="box">
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
									defaultValue="regex"
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
