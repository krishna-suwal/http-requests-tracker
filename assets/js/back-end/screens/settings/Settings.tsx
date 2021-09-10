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
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import FullScreenLoader from '../../components/layout/FullScreenLoader';
import urls from '../../constants/urls';
import { SetttingsMap } from '../../types';
import API from '../../utils/api';
import { deepClean } from '../../utils/utils';
import AdvancedSettings from './components/DeveloperSettings';
import GeneralSettings from './components/StatsSettings';

const Settings = () => {
	const settingsApi = new API(urls.settings);
	const methods = useForm<SetttingsMap>({
		reValidateMode: 'onChange',
		mode: 'onChange',
	});
	const toast = useToast();
	const queryClient = useQueryClient();

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

	const updateSettings = useMutation(
		(data: SetttingsMap) => settingsApi.store(data),
		{
			onSuccess: () => {
				toast({
					title: __('Settings is Updated', 'hrt'),
					description: __('You can keep changing settings', 'hrt'),
					status: 'success',
					isClosable: true,
				});
				queryClient.invalidateQueries(`settings`);
			},
		}
	);
	const onSubmit = (data: SetttingsMap) => {
		try {
			updateSettings.mutate(deepClean(data));
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
											<GeneralSettings data={settingsQuery.data?.stats} />
										</TabPanel>
										<TabPanel sx={tabPanelStyles}>
											<AdvancedSettings data={settingsQuery.data?.developer} />
										</TabPanel>
									</TabPanels>
									<ButtonGroup>
										<Button
											colorScheme="blue"
											type="submit"
											isLoading={updateSettings.isLoading}>
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
