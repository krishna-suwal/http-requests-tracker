import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	Image,
	Stack,
} from '@chakra-ui/react';
import React, { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import { Logo } from '../../constants/images';
import routes from '../../constants/routes';

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
	const { primaryBtn, children } = props;
	return (
		<Box bg="white" w="full" shadow="header">
			<Container maxW="container.xl" bg="white">
				<Flex direction="row" justifyContent="space-between" align="center">
					<Stack direction="row" spacing="8" align="center" minHeight="16">
						<NavLink to={routes.stats.index}>
							<Image src={Logo} w="36px" />
						</NavLink>
						{children}
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
