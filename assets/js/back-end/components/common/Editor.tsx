import { Box, Input, useOutsideClick } from '@chakra-ui/react';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import EditorMenuBar from './EditorMenuBar';
interface Props {
	name: any;
	defaultValue?: string;
	hasImageUpload?: boolean;
	willReset?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

const Editor: React.FC<Props> = (props) => {
	const { name, defaultValue, hasImageUpload, willReset, size = 'lg' } = props;
	const { register, setValue } = useFormContext();
	const ref = React.useRef<any>();

	const editor = useEditor({
		extensions: [
			StarterKit,
			Image.configure({ inline: true }),
			Dropcursor,
			Placeholder,
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
		],
		content: defaultValue,
	});

	const editorHeight = size === 'sm' ? 50 : size === 'md' ? 100 : 200;

	useOutsideClick({
		ref: ref,
		handler: () => {
			willReset && editor?.commands?.clearContent();
		},
	});

	editor?.on('update', () => {
		setValue(name, editor?.getHTML());
	});

	return (
		<Box
			border="1px"
			borderColor="gray.200"
			shadow="input"
			rounded="sm"
			sx={{
				fontSize: 'sm',
				'.ProseMirror': {
					minH: editorHeight,
				},
				'.ProseMirror:focus': {
					outline: 'none',
				},
				'.ProseMirror p.is-editor-empty:first-of-type::before': {
					content: 'attr(data-placeholder)',
					float: 'left',
					color: 'gray.300',
					pointerEvents: 'none',
					height: '0',
				},
			}}>
			<Input type="hidden" {...register(name)} defaultValue={defaultValue} />
			<EditorMenuBar editor={editor} hasImageUpload={hasImageUpload} />
			<Box p="3" ref={ref}>
				<EditorContent editor={editor} />
			</Box>
		</Box>
	);
};

export default Editor;
