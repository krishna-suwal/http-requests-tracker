import { Box, Icon } from '@chakra-ui/react';
import React from 'react';
import { Sortable } from '../../../assets/icons';

interface Props {}

const DragHandle: React.FC<Props> = (props) => {
	return (
		<Box {...props}>
			<Icon as={Sortable} />
		</Box>
	);
};

export default DragHandle;
