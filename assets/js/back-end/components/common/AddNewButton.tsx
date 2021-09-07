import { Button, ButtonProps, Icon } from '@chakra-ui/react';
import React, { forwardRef } from 'react';
import { BiPlus } from 'react-icons/bi';
import { isDevelopment } from '../../utils/helper';

const AddNewButton = forwardRef<HTMLButtonElement, ButtonProps>(
	(props, ref) => {
		const { children, ...rest } = props;

		return (
			<Button
				{...rest}
				variant="link"
				ref={ref}
				sx={{
					'.chakra-button__icon': {
						fontSize: 'lg',
						rounded: 'full',
						shadow: 'xs',
						bg: 'blue.500',
						color: 'white',
						h: '26px',
						w: '26px',
						d: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					},
				}}
				leftIcon={<Icon as={BiPlus} />}>
				{children}
			</Button>
		);
	}
);

if (isDevelopment) {
	AddNewButton.displayName = 'AddNewButton';
}

export default AddNewButton;
