import { Box, FormControl, FormHelperText, FormLabel } from '@chakra-ui/react';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Props {
	defaultValue?: string;
}
const Hightlights: React.FC<Props> = (props) => {
	const { setValue } = useFormContext();
	const { defaultValue } = props;
	const CustomDocument = Document.extend({
		content: 'bulletList',
	});

	const editor = useEditor({
		extensions: [StarterKit, Dropcursor, CustomDocument],
		content: defaultValue,
	});

	editor?.on('update', () => {
		setValue('highlights', editor?.getHTML());
	});

	return (
		<FormControl>
			<FormLabel>{__('Course Highlights', 'masteriyo')}</FormLabel>
			<Box
				border="1px"
				fontSize="sm"
				borderColor="gray.200"
				shadow="input"
				rounded="sm"
				sx={{
					'.ProseMirror': {
						minH: '100px',
						py: '2',
						px: '6',
						ul: {
							listStyleType: 'disc',
						},
					},
				}}>
				<EditorContent editor={editor} />
			</Box>
			<FormHelperText fontSize="xs">
				{__('Add your course highlight on each bullet', 'masteriyo')}
			</FormHelperText>
		</FormControl>
	);
};

export default Hightlights;
