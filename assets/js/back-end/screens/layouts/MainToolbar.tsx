import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	Icon,
	Image,
	Link,
	List,
	ListIcon,
	ListItem,
	Stack,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { BiBook, BiCog, BiEdit, BiShowAlt } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import LogoImg from '../../../../img/logo.png';
import routes from '../../constants/routes';

const MainToolbar = () => {
	const navLinkStyles = {
		mr: '10',
		py: '6',
		d: 'flex',
		alignItems: 'center',
		fontWeight: 'medium',
		fontSize: 'sm',
	};

	const navActiveStyles = {
		borderBottom: '2px',
		borderColor: 'blue.500',
		color: 'blue.500',
	};

	return (
		<Box bg="white">
			<Container maxW="container.xl">
				<Flex direction="row" justifyContent="space-between" align="center">
					<Stack direction="row" spacing="12" align="center">
						<Box>
							<Image src={LogoImg} alt="Masteriyo Logo" w="100px" />
						</Box>
						<List d="flex">
							<ListItem>
								<Link
									as={NavLink}
									sx={navLinkStyles}
									_activeLink={navActiveStyles}
									to={routes.courses.list}>
									<ListIcon as={BiBook} />
									Courses
								</Link>
							</ListItem>
							<ListItem>
								<Link
									as={NavLink}
									sx={navLinkStyles}
									_activeLink={navActiveStyles}
									to={routes.courses.add}>
									<ListIcon as={BiEdit} />
									Course Builder
								</Link>
							</ListItem>
							<ListItem>
								<Link
									as={NavLink}
									sx={navLinkStyles}
									_activeLink={navActiveStyles}
									to={routes.settings}>
									<ListIcon as={BiCog} />
									Settings
								</Link>
							</ListItem>
						</List>
					</Stack>

					<ButtonGroup>
						<Button
							leftIcon={<Icon as={BiShowAlt} w="4" h="4" />}
							variant="outline">
							{__('Preview', 'masteriyo')}
						</Button>
						<Button colorScheme="blue">{__('Save', 'masteriyo')}</Button>
					</ButtonGroup>
				</Flex>
			</Container>
		</Box>
	);
};

export default MainToolbar;
