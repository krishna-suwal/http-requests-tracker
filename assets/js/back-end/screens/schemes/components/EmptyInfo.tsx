import { Icon, Stack, Td, Text, Tr } from '@chakra-ui/react';
import React from 'react';
import { BiInfoCircle } from 'react-icons/bi';

interface Props {
	message: string;
}

const EmptyInfo: React.FC<Props> = (props) => {
	const { message } = props;
	return (
		<Tr>
			<Td>
				<Stack direction="row" spacing="1" align="center">
					<Icon as={BiInfoCircle} color="blue.400" />
					<Text as="span" fontWeight="medium" color="gray.600" fontSize="sm">
						{message}
					</Text>
				</Stack>
			</Td>
			<Td></Td>
			<Td></Td>
			<Td></Td>
			<Td></Td>
			<Td></Td>
		</Tr>
	);
};

export default EmptyInfo;
