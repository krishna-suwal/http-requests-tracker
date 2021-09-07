import { FormControl, FormLabel } from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import Editor from '../../../components/common/Editor';

interface Props {
	defaultValue?: string;
	hasImageUpload?: boolean;
}

const DescriptionInput: React.FC<Props> = (props) => {
	const { defaultValue, hasImageUpload } = props;

	return (
		<FormControl>
			<FormLabel>{__('Description', 'masteriyo')}</FormLabel>
			<Editor
				name="description"
				defaultValue={defaultValue}
				hasImageUpload={hasImageUpload}
			/>
		</FormControl>
	);
};

export default DescriptionInput;
