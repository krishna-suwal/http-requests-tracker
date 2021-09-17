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
import { StatsSettingsType } from '../../../types';

interface Props {
	data: StatsSettingsType;
}

const StatsSettings: React.FC<Props> = (props) => {
	const { data } = props;

	return (
		<Stack direction="column" spacing="6">
			<FormControl>
				<Stack direction="row">
					<FormLabel minW="xs">
						{__('Allow to show stats on frontend', 'hrt')}
						<Tooltip
							label={__('Allow to show stats on frontend', 'hrt')}
							hasArrow
							fontSize="xs">
							<Box as="span" sx={infoIconStyles}>
								<Icon as={BiInfoCircle} />
							</Box>
						</Tooltip>
					</FormLabel>

					<Controller
						name="stats>allow_stats_on_frontend"
						render={({ field }) => (
							<Switch
								{...field}
								defaultChecked={data['stats.allow_stats_on_frontend']}
								colorScheme="green"
							/>
						)}
					/>
				</Stack>
			</FormControl>
		</Stack>
	);
};

export default StatsSettings;
