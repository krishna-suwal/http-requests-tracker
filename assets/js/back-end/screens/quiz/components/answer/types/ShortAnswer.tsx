import { Alert, AlertIcon, Box, Flex, Heading, Stack } from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { sectionHeaderStyles } from '../../../../../config/styles';

interface Props {
	answersData?: any;
}

const ShortAnswer: React.FC<Props> = () => {
	return (
		<Stack direction="column" spacing="6">
			<Flex sx={sectionHeaderStyles}>
				<Heading fontSize="lg" fontWeight="semibold">
					{__('Answers', 'masteriyo')}
				</Heading>
			</Flex>
			<Box>
				<Alert status="info" fontSize="sm">
					<AlertIcon />
					{__("Short answer doesn't require any fields", 'masteriyo')}
				</Alert>
			</Box>
		</Stack>
	);
};

export default ShortAnswer;
