import {
	Box,
	FormControl,
	FormLabel,
	Icon,
	Stack,
	Switch,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tooltip,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { BiInfoCircle } from 'react-icons/bi';
import { infoIconStyles } from '../../../config/styles';
import { LearningPageSettingsMap } from '../../../types';

interface Props {
	learningPageData?: LearningPageSettingsMap;
}

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

const LearningPageSettings: React.FC<Props> = (props) => {
	const { learningPageData } = props;
	const { register } = useFormContext();

	return (
		<Tabs orientation="vertical">
			<Stack direction="row" flex="1">
				<TabList sx={tabListStyles}>
					<Tab sx={tabStyles}>{__('Display', 'masteriyo')}</Tab>
				</TabList>
				<TabPanels flex="1">
					<TabPanel>
						<Stack direction="column" spacing="8">
							<FormControl>
								<Stack direction="row" spacing="4">
									<FormLabel minW="2xs">
										{__('Enable Questions & Answers', 'masteriyo')}
										<Tooltip
											label={__(
												'Display question & answers tab on learning page',
												'masteriyo'
											)}
											hasArrow
											fontSize="xs">
											<Box as="span" sx={infoIconStyles}>
												<Icon as={BiInfoCircle} />
											</Box>
										</Tooltip>
									</FormLabel>
									<Switch
										{...register(
											'learning_page.display.enable_questions_answers'
										)}
										defaultChecked={
											learningPageData?.display?.enable_questions_answers
										}
									/>
								</Stack>
							</FormControl>
						</Stack>
					</TabPanel>
				</TabPanels>
			</Stack>
		</Tabs>
	);
};

export default LearningPageSettings;
