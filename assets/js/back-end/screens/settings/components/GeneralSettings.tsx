import {
	Box,
	FormControl,
	FormLabel,
	Icon,
	Select,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tooltip,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import ColorInput from '../../../components/common/ColorInput';
import { infoIconStyles } from '../../../config/styles';
import { GeneralSettingsMap } from '../../../types';

interface Props {
	generalData?: GeneralSettingsMap;
}

const GeneralSettings: React.FC<Props> = (props) => {
	const { generalData } = props;
	const { register, setValue } = useFormContext();

	const [primaryColor, setPrimaryColor] = useState(
		generalData?.styling?.primary_color || '#787DFF'
	);

	const tabStyles = {
		justifyContent: 'flex-start',
		w: '180px',
		borderLeft: 0,
		borderRight: '2px solid',
		borderRightColor: 'transparent',
		marginLeft: 0,
		marginRight: '-2px',
		pl: 0,
		fontSize: 'sm',
		textAlign: 'left',
	};

	const tabListStyles = {
		borderLeft: 0,
		borderRight: '2px solid',
		borderRightColor: 'gray.200',
	};

	useEffect(() => {
		setValue('general.styling.primary_color', primaryColor);
	}, [primaryColor, setValue]);

	return (
		<Tabs orientation="vertical">
			<Stack direction="row" flex="1">
				<TabList sx={tabListStyles}>
					<Tab sx={tabStyles}>{__('Styling', 'masteriyo')}</Tab>
				</TabList>
				<TabPanels flex="1">
					<TabPanel>
						<Stack direction="column" spacing="6">
							<FormControl>
								<FormLabel minW="xs">
									{__('Primary Color', 'masteriyo')}
									<Tooltip
										label={__(
											'Main color use for overall content',
											'masteriyo'
										)}
										hasArrow
										fontSize="xs">
										<Box as="span" sx={infoIconStyles}>
											<Icon as={BiInfoCircle} />
										</Box>
									</Tooltip>
								</FormLabel>
								<input
									type="hidden"
									{...register('general.styling.primary_color')}
									defaultValue={generalData?.styling?.primary_color}
								/>

								<ColorInput color={primaryColor} setColor={setPrimaryColor} />
							</FormControl>
							<FormControl>
								<FormLabel minW="xs">
									{__('Theme', 'masteriyo')}
									<Tooltip
										label={__('Styling for the theme', 'masteriyo')}
										hasArrow
										fontSize="xs">
										<Box as="span" sx={infoIconStyles}>
											<Icon as={BiInfoCircle} />
										</Box>
									</Tooltip>
								</FormLabel>
								<Select
									{...register('general.styling.theme')}
									defaultValue={generalData?.styling?.theme}>
									<option value="minimum">
										{__('Minimum Styling', 'masteriyo')}
									</option>
									<option value="custom">
										{__('Custom Styling', 'masteriyo')}
									</option>
								</Select>
							</FormControl>
						</Stack>
					</TabPanel>
				</TabPanels>
			</Stack>
		</Tabs>
	);
};

export default GeneralSettings;
