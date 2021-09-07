import {
	Box,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverTrigger,
} from '@chakra-ui/react';
import React from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

interface Props {
	color: any;
	setColor: any;
}
const ColorInput: React.FC<Props> = (props) => {
	const { color, setColor } = props;
	return (
		<Box
			sx={{
				'.color-input-field': {
					width: 'full',
					border: '1px solid',
					borderColor: 'gray.100',
					shadow: 'input',
					borderRadius: 'sm',
					px: '2',
					py: '2',
					pl: '9',
				},
			}}>
			<Popover placement="bottom-start">
				<PopoverTrigger>
					<Box pos="relative">
						<Box
							pos="absolute"
							w="20px"
							h="20px"
							bg={color}
							rounded="sm"
							top="10px"
							left="10px"
						/>
						<HexColorInput
							onChange={setColor}
							color={color}
							className="color-input-field"
						/>
					</Box>
				</PopoverTrigger>
				<PopoverContent>
					<PopoverArrow />
					<PopoverCloseButton />
					<PopoverBody>
						<HexColorPicker onChange={setColor} color={color} />
					</PopoverBody>
				</PopoverContent>
			</Popover>
		</Box>
	);
};

export default ColorInput;
