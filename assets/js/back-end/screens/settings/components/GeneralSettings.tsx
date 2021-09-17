import {
	Box,
	FormControl,
	FormLabel,
	Icon,
	Stack,
	Switch,
	Tooltip,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { Controller } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import { infoIconStyles } from '../../../config/styles';
import { GeneralSettingsType } from '../../../types';

interface Props {
	data: GeneralSettingsType;
}

const GeneralSettings: React.FC<Props> = (props) => {
	const { data } = props;

	return (
		<Stack direction="column" spacing="6">
			<FormControl>
				<Stack direction="row">
					<FormLabel minW="xs">
						{__('Start tracking http requests', 'hrt')}
						<Tooltip
							label={__('Enable/Disable tracking of http requests', 'hrt')}
							hasArrow
							fontSize="xs">
							<Box as="span" sx={infoIconStyles}>
								<Icon as={BiInfoCircle} />
							</Box>
						</Tooltip>
					</FormLabel>

					<Controller
						name="schemes>enable"
						render={({ field }) => (
							<Switch
								{...field}
								defaultChecked={data['schemes.enable']}
								colorScheme="green"
							/>
						)}
					/>
				</Stack>
			</FormControl>
		</Stack>
	);
};

export default GeneralSettings;
