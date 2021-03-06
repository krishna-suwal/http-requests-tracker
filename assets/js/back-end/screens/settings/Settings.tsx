import {
	Box,
	Container,
	Heading,
	Stack,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useColorModeValue,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import Header from '../../components/common/Header';
import urls from '../../constants/urls';
import { useSaver } from '../../hooks/saving-signals';
import { SkeletonSettings } from '../../skeleton';
import { SetttingsMap } from '../../types';
import API from '../../utils/api';
import { prepareSettingData } from '../../utils/utils';
import DeveloperSettings from './components/DeveloperSettings';
import GeneralSettings from './components/GeneralSettings';

const Settings = () => {
	const borderColor = useColorModeValue('gray.100', 'gray.700');
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

	return (
		<Tabs colorScheme="green">
			<FormProvider {...methods}>
				<Header
					primaryBtn={{
						label: __('Update Settings', 'hrt'),
						action: methods.handleSubmit(onSubmit),
						isLoading: isSavingSetting,
						isDisabled: settingsQuery.isLoading || !settingsQuery.isSuccess,
					}}>
					<Stack direction="row" align="center" spacing="10">
						<Heading fontSize="md" fontWeight="bold" color="gray.500">
							{__('Settings', 'hrt')}
						</Heading>
						<TabList borderBottom="none">
							<Tab sx={tabStyles}>{__('General', 'hrt')}</Tab>
							<Tab sx={tabStyles}>{__('Developer', 'hrt')}</Tab>
						</TabList>
					</Stack>
				</Header>
				<Container maxW="container.xl" pt="5">
					<Box border="1px" borderColor={borderColor} borderRadius="md" p="8">
						<form onSubmit={methods.handleSubmit(onSubmit)}>
							<TabPanels>
								<TabPanel sx={tabPanelStyles}>
									{settingsQuery.isLoading ? (
										<SkeletonSettings />
									) : (
										settingsQuery.data && (
											<GeneralSettings data={settingsQuery.data} />
										)
									)}
								</TabPanel>
								<TabPanel sx={tabPanelStyles}>
									{settingsQuery.isLoading ? (
										<SkeletonSettings />
									) : (
										settingsQuery.data && (
											<DeveloperSettings data={settingsQuery.data} />
										)
									)}
								</TabPanel>
							</TabPanels>
						</form>
					</Box>
				</Container>
			</FormProvider>
		</Tabs>
	);
};

export default Settings;
