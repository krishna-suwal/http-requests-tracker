import { Box, Stack } from '@chakra-ui/react';
import React from 'react';
import { CourseDataMap } from '../../types/course';
import Categories from './components/Categories';
import Description from './components/Description';
import FeaturedImage from './components/FeaturedImage';
import Hightlights from './components/Highlights';
import Name from './components/Name';

interface Props {
	courseData: CourseDataMap;
}

const EditCourse: React.FC<Props> = (props) => {
	const { courseData } = props;

	return (
		<form>
			<Stack direction="row" spacing="8">
				<Box
					flex="1"
					bg="white"
					p="10"
					shadow="box"
					d="flex"
					flexDirection="column"
					justifyContent="space-between">
					<Stack direction="column" spacing="6">
						<Name defaultValue={courseData?.name} />
						<Description defaultValue={courseData?.description} />
					</Stack>
				</Box>
				<Box w="400px" bg="white" p="10" shadow="box">
					<Stack direction="column" spacing="6">
						<Hightlights defaultValue={courseData?.highlights} />

						<Categories defaultValue={courseData?.categories} />
						<FeaturedImage defaultValue={courseData?.featured_image} />
					</Stack>
				</Box>
			</Stack>
		</form>
	);
};

export default EditCourse;
