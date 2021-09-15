import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import urls from '../../constants/urls';
import { useSaver } from '../../hooks/saving-signals';
import { SetttingsMap } from '../../types';
import API from '../../utils/api';
import { prepareSettingData } from '../../utils/utils';
import AdvancedSettings from './components/DeveloperSettings';
import GeneralSettings from './components/StatsSettings';

const Settings = () => {
	const { isSaving: isSavingSetting, save } = useSaver('settings');
	const settingsApi = new API(urls.settings);
	const methods = useForm<SetttingsMap>({
		reValidateMode: 'onChange',
		mode: 'onChange',
	});

	const tabStyles = {
		fontWeight: 'medium',
		fontSize: 'sm',
		py: '4',
	};

	const tabPanelStyles = {
		px: '0',
		py: 8,
	};

	const settingsQuery = useQuery<SetttingsMap>('settings', () =>
		settingsApi.list()
	);

	const onSubmit = (data: SetttingsMap) => {
		try {
			save(prepareSettingData(data));
		} catch (err) {
			console.error(err);
		}
	};

	if (settingsQuery.isSuccess) {
		return (
			<FormProvider {...methods}>
				<Stack direction="column" spacing="8" width="full" alignItems="center">
					<Container maxW="container.xl" pt="5">
						<Box bg="white" p="10" shadow="box">
							<Tabs>
								<TabList justifyContent="center" borderBottom="1px">
									<Tab sx={tabStyles}>{__('Stats', 'hrt')}</Tab>
									<Tab sx={tabStyles}>{__('Developer', 'hrt')}</Tab>
								</TabList>

								<form onSubmit={methods.handleSubmit(onSubmit)}>
									<TabPanels>
										<TabPanel sx={tabPanelStyles}>
											<GeneralSettings data={settingsQuery.data} />
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<AdvancedSettings data={settingsQuery.data} />
										</TabPanel>
									</TabPanels>
									<ButtonGroup>
										<Button
											colorScheme="blue"
											type="submit"
											isLoading={isSavingSetting}>
											{__('Save Settings', 'hrt')}
										</Button>
									</ButtonGroup>
								</form>
							</Tabs>
						</Box>
					</Container>
				</Stack>
			</FormProvider>
		);
	}
	return <FullScreenLoader />;
};

export default Settings;
