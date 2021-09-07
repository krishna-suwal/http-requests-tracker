import { FormControl, FormLabel } from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import Editor from '../../../components/common/Editor';

interface Props {
	defaultValue?: string;
}

const Description: React.FC<Props> = (props) => {
	const { defaultValue } = props;

	return (
		<FormControl>
			<FormLabel>{__('Quiz Description', 'masteriyo')}</FormLabel>
			<Editor
				name="description"
				defaultValue={defaultValue}
				hasImageUpload={true}
			/>
		</FormControl>
	);
};

export default Description;
