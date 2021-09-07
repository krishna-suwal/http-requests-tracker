import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Select,
	Stack,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

interface Props {
	defaultSource?: any;
	defaultSourceUrl?: any;
}
const VideoSource: React.FC<Props> = (props) => {
	const { defaultSource, defaultSourceUrl } = props;
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext();

	const watchSource = useWatch({
		name: 'video_source',
		defaultValue: defaultSource || 'self-hosted',
		control,
	});

	return (
		<Stack direction="row" spacing="6">
			<FormControl>
				<FormLabel>{__('Video Source', 'masteriyo')}</FormLabel>
				<Select {...register('video_source')} defaultValue={defaultSource}>
					<option value="self-hosted">{__('Self Hosted', 'materiyo')}</option>
					<option value="youtube">{__('YouTube', 'materiyo')}</option>
					<option value="vimeo">{__('Vimeo', 'materiyo')}</option>
				</Select>
			</FormControl>
			{watchSource !== 'self-hosted' && (
				<FormControl isInvalid={!!errors.video_source_url}>
					<FormLabel>{__('Video Source URL', 'masteriyo')}</FormLabel>
					<Input
						type="text"
						defaultValue={defaultSourceUrl}
						{...register('video_source_url', {
							pattern: {
								value:
									watchSource === 'youtube'
										? /\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9_\-]+)/i
										: /\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_]+)/i,
								message: __('Please Provide Valid URL'),
							},
						})}
					/>
					<FormErrorMessage>
						{errors?.video_source_url && errors?.video_source_url?.message}
					</FormErrorMessage>
				</FormControl>
			)}
		</Stack>
	);
};

export default VideoSource;
