import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	Image,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../../constants/images';
import routes from '../../constants/routes';
import { useAllSaver } from '../../hooks/saving-signals';

interface Props {
	primaryBtn?: {
		label: string;
		action: () => void;
		isDisabled?: boolean;
		isLoading?: boolean;
		icon?: ReactElement;
	};
}

const Header: React.FC<Props> = (props) => {
	const { isSaving: isSavingAnything } = useAllSaver();
	const { primaryBtn, children } = props;

	return (
		<Box bg="white" w="full" shadow="header">
			<Container maxW="container.xl" bg="white">
				<Flex direction="row" justifyContent="space-between" align="center">
					<Stack direction="row" spacing="8">
						<Stack direction="row" spacing="8" align="center" minHeight="16">
							<NavLink to={routes.stats.index}>
								<Image src={Logo} w="36px" />
							</NavLink>
							{children}
						</Stack>

						{isSavingAnything && (
							<Stack direction="row" spacing="2" align="center" minHeight="16">
								<Spinner
									size="sm"
									color="blue.500"
									emptyColor="gray.200"
									thickness="1px"
								/>{' '}
								<Text>{__('Saving...', 'masteriyo')}</Text>
							</Stack>
						)}
					</Stack>

					<ButtonGroup>
						{primaryBtn && (
							<Button
								colorScheme="blue"
								onClick={primaryBtn.action}
								isDisabled={primaryBtn.isDisabled}
								leftIcon={primaryBtn.icon}
								isLoading={primaryBtn.isLoading}>
								{primaryBtn.label}
							</Button>
						)}
					</ButtonGroup>
				</Flex>
			</Container>
		</Box>
	);
};

export default Header;
