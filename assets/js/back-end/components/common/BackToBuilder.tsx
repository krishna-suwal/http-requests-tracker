import { Button, ButtonGroup, Icon } from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { BiChevronLeft } from 'react-icons/bi';
import { Link, useParams } from 'react-router-dom';
import routes from '../../constants/routes';

const BackToBuilder = () => {
	const { courseId }: any = useParams();

	return (
		<ButtonGroup>
			<Link
				to={
					routes.courses.edit.replace(':courseId', courseId.toString()) +
					'?page=builder'
				}>
				<Button
					variant="link"
					_hover={{ color: 'blue.500' }}
					leftIcon={<Icon fontSize="xl" as={BiChevronLeft} />}>
					{__('Back to Builder', 'masteriyo')}
				</Button>
			</Link>
		</ButtonGroup>
	);
};

export default BackToBuilder;
