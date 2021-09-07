import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Box,
	Button,
	ButtonGroup,
	Collapse,
	Flex,
	Icon,
	IconButton,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Stack,
	Text,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useRef, useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import {
	BiAlignLeft,
	BiDotsVerticalRounded,
	BiEdit,
	BiTimer,
	BiTrash,
} from 'react-icons/bi';
import { useMutation, useQueryClient } from 'react-query';
import { Link as RouterLink } from 'react-router-dom';
import { Sortable } from '../../../assets/icons';
import AddNewButton from '../../../components/common/AddNewButton';
import { whileDraggingStyles } from '../../../config/styles';
import routes from '../../../constants/routes';
import urls from '../../../constants/urls';
import API from '../../../utils/api';
import Content from './Content';
import EditSection from './EditSection';

interface Props {
	id: number;
	name: string;
	courseId: number;
	description?: any;
	index: number;
	contents: any;
	contentsMap: any;
	onDeletePress: any;
}

const Section: React.FC<Props> = (props) => {
	const {
		id,
		name,
		description,
		index,
		contents,
		contentsMap,
		courseId,
		onDeletePress,
	} = props;
	const [isEditing, setIsEditing] = useState(false);
	const { onClose, onOpen, isOpen } = useDisclosure();

	const [deleteLessonId, setDeleteLessonId] = useState<number>();
	const [deleteQuizId, setDeleteQuizId] = useState<number>();
	const [contentType, setContentType] = useState<'lesson' | 'quiz'>();

	const cancelRef = useRef<any>();

	const newContents = contents?.map((contentId: any) => contentsMap[contentId]);
	const queryClient = useQueryClient();
	const toast = useToast();

	const lessonAPI = new API(urls.lessons);
	const quizAPI = new API(urls.quizes);

	const deleteLesson = useMutation((id: number) => lessonAPI.delete(id), {
		onSuccess: (data: any) => {
			onClose();
			toast({
				title: __('Lesson Deleted', 'masteriyo'),
				description:
					data?.name + __(' has been deleted successfully', 'masteriyo'),
				isClosable: true,
				status: 'error',
			});
			queryClient.invalidateQueries(`builder${courseId}`);
		},
	});

	const deleteQuiz = useMutation((id: number) => quizAPI.delete(id), {
		onSuccess: (data: any) => {
			onClose();
			toast({
				title: __('Quiz Deleted', 'masteriyo'),
				description:
					data?.name + __(' has been deleted successfully', 'masteriyo'),
				isClosable: true,
				status: 'error',
			});
			queryClient.invalidateQueries(`builder${courseId}`);
		},
	});

	const onEditPress = () => {
		setIsEditing(true);
	};

	const onContentDeletePress = (contentId: number, type: 'lesson' | 'quiz') => {
		onOpen();
		if (type === 'lesson') {
			setDeleteLessonId(contentId);
			setContentType(type);
		} else if (type === 'quiz') {
			setDeleteQuizId(contentId);
			setContentType(type);
		}
	};

	const onDeleteConfirm = () => {
		if (contentType === 'lesson') {
			deleteLessonId && deleteLesson.mutate(deleteLessonId);
		} else if (contentType === 'quiz') {
			deleteQuizId && deleteQuiz.mutate(deleteQuizId);
		}
	};

	return (
		<Draggable draggableId={id.toString()} index={index}>
			{(draggableProvided) => (
				<Box
					bg="white"
					shadow="box"
					mb="8"
					p="3"
					ref={draggableProvided.innerRef}
					{...draggableProvided.draggableProps}>
					<Flex justify="space-between" p="5">
						<Stack direction="row" spacing="3" align="center">
							<span {...draggableProvided.dragHandleProps}>
								<Icon as={Sortable} fontSize="lg" color="gray.500" />
							</span>

							<Text fontWeight="semibold" fontSize="xl">
								{name}
							</Text>
						</Stack>
						<Menu placement="bottom-end">
							<MenuButton
								as={IconButton}
								icon={<BiDotsVerticalRounded />}
								variant="outline"
								rounded="sm"
								fontSize="large"
							/>
							<MenuList>
								<MenuItem onClick={onEditPress} icon={<BiEdit />}>
									{__('Edit', 'masteriyo')}
								</MenuItem>
								<MenuItem onClick={() => onDeletePress(id)} icon={<BiTrash />}>
									{__('Delete', 'masteriyo')}
								</MenuItem>
							</MenuList>
						</Menu>
					</Flex>

					<Collapse in={isEditing} animateOpacity>
						<EditSection
							id={id}
							courseId={courseId}
							name={name}
							description={description}
							onSave={() => setIsEditing(false)}
							onCancel={() => setIsEditing(false)}
						/>
					</Collapse>
					<Box px="2">
						<Droppable droppableId={id.toString()} type="content">
							{(droppableProvided, snapshot) => (
								<Box
									p="3"
									minH="8"
									sx={snapshot.isDraggingOver ? whileDraggingStyles : {}}
									ref={droppableProvided.innerRef}
									{...droppableProvided.droppableProps}>
									{newContents &&
										newContents?.map((content: any, index: any) => (
											<Content
												key={content.id}
												id={content.id}
												name={content.name}
												type={content.type}
												index={index}
												courseId={courseId}
												onContentDeletePress={onContentDeletePress}
											/>
										))}
									{droppableProvided.placeholder}
								</Box>
							)}
						</Droppable>
					</Box>

					<Box p="5">
						<Menu>
							<MenuButton as={AddNewButton}>
								{__('Add New Content', 'masteriyo')}
							</MenuButton>
							<MenuList>
								<Link
									as={RouterLink}
									to={routes.lesson.add
										.replace(':sectionId', id.toString())
										.replace(':courseId', courseId.toString())}>
									<MenuItem
										fontSize="sm"
										fontWeight="medium"
										icon={<Icon as={BiAlignLeft} fontSize="lg" />}>
										{__('Add New Lesson', 'masteriyo')}
									</MenuItem>
								</Link>

								<Link
									as={RouterLink}
									to={routes.quiz.add
										.replace(':sectionId', id.toString())
										.replace(':courseId', courseId.toString())}>
									<MenuItem
										fontSize="sm"
										fontWeight="medium"
										icon={<Icon as={BiTimer} fontSize="lg" />}>
										{__('Add New Quiz', 'masteriyo')}
									</MenuItem>
								</Link>
							</MenuList>
						</Menu>
					</Box>
					<AlertDialog
						isOpen={isOpen}
						onClose={onClose}
						isCentered
						leastDestructiveRef={cancelRef}>
						<AlertDialogOverlay>
							<AlertDialogContent>
								<AlertDialogHeader>
									{__('Delete Section')} {name}
								</AlertDialogHeader>
								<AlertDialogBody>
									{__(
										"Are you sure? You can't restore this section",
										'masteriyo'
									)}
								</AlertDialogBody>
								<AlertDialogFooter>
									<ButtonGroup>
										<Button ref={cancelRef} onClick={onClose} variant="outline">
											{__('Cancel', 'masteriyo')}
										</Button>
										<Button
											colorScheme="red"
											onClick={onDeleteConfirm}
											isLoading={
												deleteQuiz.isLoading || deleteLesson.isLoading
											}>
											{__('Delete', 'masteriyo')}
										</Button>
									</ButtonGroup>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialogOverlay>
					</AlertDialog>
				</Box>
			)}
		</Draggable>
	);
};

export default Section;
