import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	IconButton,
	Image,
	Spinner,
	Stack,
	Text,
	useColorMode,
	useColorModeValue,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { ReactElement } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
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
	const { toggleColorMode } = useColorMode();
	const ColorModeToggleIcon = useColorModeValue(FaSun, FaMoon);
	const { isSaving: isSavingAnything } = useAllSaver();
	const { primaryBtn, children } = props;

	return (
		<Box w="full" shadow="header">
			<Container maxW="container.xl">
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
									color="green.500"
									emptyColor="gray.200"
									thickness="1px"
								/>{' '}
								<Text>{__('Saving...', 'masteriyo')}</Text>
							</Stack>
						)}
					</Stack>

					<Stack direction="row" spacing="6">
						<ButtonGroup>
							{primaryBtn && (
								<Button
									colorScheme="green"
									onClick={primaryBtn.action}
									isDisabled={primaryBtn.isDisabled}
									leftIcon={primaryBtn.icon}
									isLoading={primaryBtn.isLoading}
									px="6"
									borderRadius="3xl">
									{primaryBtn.label}
								</Button>
							)}
						</ButtonGroup>
						<IconButton
							icon={<ColorModeToggleIcon />}
							isRound
							aria-label={__('toggle color mode')}
							onClick={toggleColorMode}
						/>
					</Stack>
				</Flex>
			</Container>
		</Box>
	);
};

export default Header;
