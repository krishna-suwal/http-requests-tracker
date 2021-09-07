import {
	Box,
	Center,
	Divider,
	Icon,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Stack,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react';
import { EditorContentProps } from '@tiptap/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import {
	BiAlignJustify,
	BiAlignLeft,
	BiAlignMiddle,
	BiAlignRight,
	BiBold,
	BiCode,
	BiCodeBlock,
	BiImageAdd,
	BiItalic,
	BiListOl,
	BiListUl,
	BiMinus,
	BiParagraph,
	BiStrikethrough,
	BiSubdirectoryLeft,
} from 'react-icons/bi';
import { ImQuotesLeft } from 'react-icons/im';
import { deepMerge } from '../../utils/utils';
import ImageUploadModal from './ImageUploadModal';

interface Props extends EditorContentProps {
	hasImageUpload?: boolean;
}

const EditorMenuBar: React.FC<Props> = (props) => {
	const { editor, hasImageUpload } = props;
	const { isOpen, onClose, onOpen } = useDisclosure();

	const buttonStyles = (isActive?: boolean) => {
		if (isActive) {
			return {
				bg: 'blue.500',
				color: 'white',
			};
		} else {
			return {
				bg: 'transparent',
				color: 'gray.700',
			};
		}
	};

	const buttonCommonStyles = (isActive?: boolean) => {
		return deepMerge(buttonStyles(isActive), {
			fontSize: '16px',
			minW: 'auto',
			width: '26px',
			height: '26px',
			p: '1',
			borderRadius: '0.25rem',
			alignItems: 'center',
			justifyContent: 'center',
			display: 'flex',
			cursor: 'pointer',
		});
	};

	if (!editor) {
		return null;
	}

	const onImageUpload = (imageUrl: string) => {
		imageUrl && editor.chain().focus().setImage({ src: imageUrl }).run();
		onClose();
	};

	return (
		<Stack
			direction="row"
			spacing="1"
			px="1"
			py="2"
			align="center"
			justify="space-between"
			borderBottom="1px"
			borderColor="gray.100">
			<Stack direction="row" spacing="1" align="center">
				<Tooltip label={__('Bold', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive('bold'))}
						onClick={() => editor.chain().focus().toggleBold().run()}>
						<Icon as={BiBold} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Italic', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive('italic'))}
						onClick={() => editor.chain().focus().toggleItalic().run()}>
						<Icon as={BiItalic} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Strike', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive('strike'))}
						onClick={() => editor.chain().focus().toggleStrike().run()}>
						<Icon as={BiStrikethrough} />
					</Box>
				</Tooltip>

				<Center height="20px">
					<Divider orientation="vertical" />
				</Center>

				<Tooltip label={__('Code', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive('code'))}
						onClick={() => editor.chain().focus().toggleCode().run()}>
						<Icon as={BiCode} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Paragraph', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive('paragraph'))}
						onClick={() => editor.chain().focus().setParagraph().run()}>
						<Icon as={BiParagraph} />
					</Box>
				</Tooltip>

				<Center height="20px">
					<Divider orientation="vertical" />
				</Center>
				<Menu>
					<Tooltip label={__('Headings', 'masteriyo')} hasArrow fontSize="xs">
						<MenuButton as="span">Headings</MenuButton>
					</Tooltip>

					<MenuList fontSize="xs">
						<MenuItem
							sx={buttonStyles(editor.isActive('heading', { level: 1 }))}
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 1 }).run()
							}>
							h1
						</MenuItem>
						<MenuItem
							sx={buttonStyles(editor.isActive('heading', { level: 2 }))}
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 2 }).run()
							}>
							h2
						</MenuItem>
						<MenuItem
							sx={buttonStyles(editor.isActive('heading', { level: 3 }))}
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 3 }).run()
							}>
							h3
						</MenuItem>
						<MenuItem
							sx={buttonStyles(editor.isActive('heading', { level: 4 }))}
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 4 }).run()
							}>
							h4
						</MenuItem>
						<MenuItem
							sx={buttonStyles(editor.isActive('heading', { level: 5 }))}
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 5 }).run()
							}>
							h5
						</MenuItem>
						<MenuItem
							sx={buttonStyles(editor.isActive('heading', { level: 6 }))}
							onClick={() =>
								editor.chain().focus().toggleHeading({ level: 6 }).run()
							}>
							h6
						</MenuItem>
					</MenuList>
				</Menu>

				<Center height="20px">
					<Divider orientation="vertical" />
				</Center>
				<Tooltip label={__('Align Left', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive({ textAlign: 'left' }))}
						onClick={() => editor.chain().focus().setTextAlign('left').run()}>
						<Icon as={BiAlignLeft} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Align Center', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive({ textAlign: 'center' }))}
						onClick={() => editor.chain().focus().setTextAlign('center').run()}>
						<Icon as={BiAlignMiddle} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Align Right', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive({ textAlign: 'right' }))}
						onClick={() => editor.chain().focus().setTextAlign('right').run()}>
						<Icon as={BiAlignRight} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Justify', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive({ textAlign: 'justify' }))}
						onClick={() =>
							editor.chain().focus().setTextAlign('justify').run()
						}>
						<Icon as={BiAlignJustify} />
					</Box>
				</Tooltip>

				<Center height="20px">
					<Divider orientation="vertical" />
				</Center>
				<Tooltip label={__('Bullet List', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive('bulletList'))}
						onClick={() => editor.chain().focus().toggleBulletList().run()}>
						<Icon as={BiListUl} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Ordered List', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive('orderedList'))}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}>
						<Icon as={BiListOl} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Code Block', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive('codeBlock'))}
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
						<Icon as={BiCodeBlock} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Blockquote', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles(editor.isActive('blockquote'))}
						onClick={() => editor.chain().focus().toggleBlockquote().run()}>
						<Icon as={ImQuotesLeft} />
					</Box>
				</Tooltip>

				<Tooltip
					label={__('Horizontal Rule', 'masteriyo')}
					hasArrow
					fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles()}
						onClick={() => editor.chain().focus().setHorizontalRule().run()}>
						<Icon as={BiMinus} />
					</Box>
				</Tooltip>

				<Tooltip label={__('Hard Break', 'masteriyo')} hasArrow fontSize="xs">
					<Box
						as="span"
						sx={buttonCommonStyles()}
						onClick={() => editor.chain().focus().setHardBreak().run()}>
						<Icon as={BiSubdirectoryLeft} />
					</Box>
				</Tooltip>
			</Stack>
			{hasImageUpload && (
				<Stack direction="row" spacing="1" align="center">
					<Tooltip
						label={__('Upload Image', 'masteriyo')}
						hasArrow
						fontSize="xs">
						<Box as="span" sx={buttonCommonStyles()} onClick={onOpen}>
							<Icon as={BiImageAdd} />
						</Box>
					</Tooltip>

					<ImageUploadModal
						isOpen={isOpen}
						onClose={onClose}
						get="url"
						onComplete={onImageUpload}
					/>
				</Stack>
			)}
		</Stack>
	);
};

export default EditorMenuBar;
