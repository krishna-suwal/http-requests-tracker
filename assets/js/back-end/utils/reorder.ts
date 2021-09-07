import { DropResult } from 'react-beautiful-dnd';

export const reorder = (result: DropResult, builderData: any) => {
	const { source, destination, draggableId, type } = result;

	// if dropped outside the droppable area
	if (!destination) {
		return builderData;
	}

	// moving to same place
	if (
		destination.droppableId === source.droppableId &&
		destination.index === source.index
	) {
		return builderData;
	}

	// moving section
	if (type === 'section') {
		const newSectionOrder = Array.from(builderData.section_order);
		newSectionOrder.splice(source.index, 1);
		newSectionOrder.splice(destination.index, 0, draggableId);

		const newBuilderData = {
			...builderData,
			section_order: newSectionOrder,
		};

		return newBuilderData;
	}

	// moving content
	if (type === 'content') {
		const currentSection = builderData.sections[source.droppableId];
		const destinationSection = builderData.sections[destination.droppableId];

		// moving on same section
		if (currentSection === destinationSection) {
			const newContents = Array.from(currentSection.contents);
			newContents.splice(source.index, 1);
			newContents.splice(destination.index, 0, draggableId);

			const newSection = {
				...currentSection,
				contents: newContents,
			};

			const newBuilderData = {
				...builderData,
				sections: {
					...builderData.sections,
					[newSection.id]: newSection,
				},
			};

			return newBuilderData;
		} else {
			const currentContents = Array.from(currentSection.contents);
			currentContents.splice(source.index, 1);

			const newCurrentSection = {
				...currentSection,
				contents: currentContents,
			};

			const destinationContents = Array.from(destinationSection.contents);
			destinationContents.splice(destination.index, 0, draggableId);

			const newDestinationSection = {
				...destinationSection,
				contents: destinationContents,
			};

			const newBuilderData = {
				...builderData,
				sections: {
					...builderData.sections,
					[newCurrentSection.id]: newCurrentSection,
					[newDestinationSection.id]: newDestinationSection,
				},
			};

			return newBuilderData;
		}
	}
};
