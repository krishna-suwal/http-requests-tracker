import { Center, Spinner } from '@chakra-ui/react';
import React from 'react';

const FullScreenLoader = () => {
	return (
		<Center h="calc(100vh - 60px)">
			<Spinner
				size="lg"
				color="green.500"
				emptyColor="gray.200"
				thickness="3px"
			/>
		</Center>
	);
};

export default FullScreenLoader;
