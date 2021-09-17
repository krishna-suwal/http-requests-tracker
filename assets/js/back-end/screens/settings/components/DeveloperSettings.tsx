import {
	Alert,
	AlertIcon,
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
import { DeveloperSettingsType } from '../../../types';

interface Props {
	data: DeveloperSettingsType;
}

const DeveloperSettings: React.FC<Props> = (props) => {
	const { data } = props;

	return (
		<Stack direction="column" spacing="8">
			<Alert status="warning">
				<AlertIcon />
				{__(
					'This section is for developers for debugging purpose and not recommended to change it without understanding of the outcomes.',
					'hrt'
				)}
			</Alert>

			<FormControl>
				<Stack direction="row">
					<FormLabel minW="3xs">
						{__('Debug', 'hrt')}
						<Tooltip
							label={__('Use for plugin debugging', 'hrt')}
							hasArrow
							fontSize="xs">
							<Box as="span" sx={infoIconStyles}>
								<Icon as={BiInfoCircle} />
							</Box>
						</Tooltip>
					</FormLabel>
					<Controller
						name="developer>debug"
						render={({ field }) => (
							<Switch
								{...field}
								defaultChecked={data['developer.debug']}
								colorScheme="green"
							/>
						)}
					/>
				</Stack>
			</FormControl>
		</Stack>
	);
};

export default DeveloperSettings;
