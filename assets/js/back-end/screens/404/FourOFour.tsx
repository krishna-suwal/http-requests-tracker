import {
	Box,
	Button,
	Center,
	Heading,
	Image,
	Text,
	VStack,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { Link } from 'react-router-dom';
import { NotFound } from '../../constants/images';
import routes from '../../constants/routes';

const FourOFour = () => {
	return (
		<Box>
			<Center maxW="350px" mx="auto">
				<VStack>
					<Image src={NotFound} />
					<VStack spacing="6">
						<Heading size="4xl">{__('404', 'masteriyo')}</Heading>
						<Heading fontSize="md">
							{__('Oops - Page Not Found', 'masteriyo')}
						</Heading>
						<Text fontSize="sm" color="gray.500">
							{__('We can not find the page you are looking for', 'masteriyo')}
						</Text>
						<Link to={routes.stats.index}>
							<Button colorScheme="blue">
								{__('Back to Stats', 'masteriyo')}
							</Button>
						</Link>
					</VStack>
				</VStack>
			</Center>
		</Box>
	);
};

export default FourOFour;
