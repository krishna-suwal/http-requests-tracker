import { useToast } from '@chakra-ui/toast';
import { __ } from '@wordpress/i18n';
import { useMutation } from 'react-query';
import urls from '../constants/urls';
import { SetttingsMap } from '../types';
import API from '../utils/api';
import { useRegisterSaveHandler, useSaver } from './saving-signals';

const useAppSavers = () => {
	const settingsApi = new API(urls.settings);
	const { savingComplete: savedSettings } = useSaver('settings');
	const toast = useToast({
		position: 'bottom-right',
	});
	const updateSettings = useMutation(
		(data: SetttingsMap) => settingsApi.store({ data }),
		{
			onSuccess: () => {
				toast({
					title: __('Saved', 'masteriyo'),
					isClosable: true,
					status: 'success',
				});
			},
			onError: (error: any) => {
				toast({
					title: __('Failed to update settings', 'masteriyo'),
					description: `${error.response?.data?.message}`,
					isClosable: true,
					status: 'error',
				});
				console.error(error);
			},
			onSettled: () => {
				savedSettings();
			},
		}
	);

	useRegisterSaveHandler('settings', function ({ data }) {
		try {
			updateSettings.mutate(data);
		} catch (err) {
			console.error(err);
		}
	});
};

export default useAppSavers;
