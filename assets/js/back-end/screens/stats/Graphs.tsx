import { Box, Container } from '@chakra-ui/react';
import React from 'react';

interface Props {}

const Graphs: React.FC<Props> = () => {
	return (
		<Container maxW="container.xl">
			<Box bg="white" p="12" shadow="box" mx="auto">
				<span>Graphs not implemented!</span>
			</Box>
		</Container>
	);
};

export default Graphs;
