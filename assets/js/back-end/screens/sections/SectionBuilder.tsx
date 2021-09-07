import { Center } from '@chakra-ui/layout';
import {
	Box,
	Button,
	ButtonGroup,
	Collapse,
	Heading,
	Stack,
	Text,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useRef, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import AddNewButton from '../../components/common/AddNewButton';
import { reorder } from '../../utils/reorder';
import { isEmpty } from '../../utils/utils';
import NewSection from './components/NewSection';
import Section from './components/Section';

interface Props {
	courseId: number | any;
	builderData: any;
	setBuilderData: any;
	onDeletePress: any;
}

const SectionBuilder: React.FC<Props> = (props) => {
	const { courseId, builderData, setBuilderData, onDeletePress } = props;
	const [isAddNewSection, setIsAddNewSection] = useState(false);
	const scrollRef = useRef<any>(null);

	const onDragEnd = (result: DropResult) => {
		const orderedData = reorder(result, builderData);
		setBuilderData(orderedData);
	};

	const onAddNewSectionPress = () => {
		setIsAddNewSection(true);
		setTimeout(() => {
			scrollRef.current.scrollIntoView({ behavior: 'smooth' });
		}, 600);
	};
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId="section" type="section">
				{(droppableProvided) => (
					<Box
						ref={droppableProvided.innerRef}
						{...droppableProvided.droppableProps}>
						{builderData?.section_order?.map((sectionId: any, index: any) => {
							const section = builderData.sections[sectionId];
							return (
								<Section
									key={section.id}
									id={section.id}
									index={index}
									name={section.name}
									description={section.description}
									courseId={courseId}
									contents={section.contents}
									contentsMap={builderData.contents}
									onDeletePress={onDeletePress}
								/>
							);
						})}

						<Collapse in={isAddNewSection} animateOpacity>
							<Box ref={scrollRef}>
								<NewSection
									courseId={courseId}
									onSave={() => setIsAddNewSection(false)}
									onCancel={() => setIsAddNewSection(false)}
								/>
							</Box>
						</Collapse>

						{isEmpty(builderData.section_order)
							? !isAddNewSection && (
									<Box
										py="16"
										px="8"
										bg="white"
										shadow="box"
										mb="8"
										textAlign="center">
										<Stack direction="column">
											<Heading fontSize="2xl">
												{__('Get Started', 'Masteriyo')}
											</Heading>
											<Stack direction="column" spacing="6">
												<Text color="gray.500" fontSize="xs">
													{__(
														'Add new section to add your content',
														'masteriyo'
													)}
												</Text>
												<ButtonGroup justifyContent="center">
													<Button
														colorScheme="blue"
														onClick={onAddNewSectionPress}>
														{__('Add New Section', 'masteriyo')}
													</Button>
												</ButtonGroup>
												<Text color="gray.500" fontSize="xs">
													{__(
														'Not sure how to get started? Learn more in our',
														'masteriyo'
													)}
													<Text as="span" color="gray.800" fontSize="xs">
														{__(' Documentation', 'masteriyo')}
													</Text>
												</Text>
											</Stack>
										</Stack>
									</Box>
							  )
							: !isAddNewSection && (
									<Center mb="8">
										<AddNewButton onClick={onAddNewSectionPress}>
											{__('Add New Section', 'masteriyo')}
										</AddNewButton>
									</Center>
							  )}
						{droppableProvided.placeholder}
					</Box>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default SectionBuilder;
