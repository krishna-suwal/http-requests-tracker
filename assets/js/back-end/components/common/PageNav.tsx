import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	Icon,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { BiChevronRight } from 'react-icons/bi';
import { Link as RouterLink } from 'react-router-dom';
import routes from '../../constants/routes';

interface Props {
	currentTitle: string;
	courseId?: number;
	courseName?: string;
	hasCategoryName?: boolean;
	isTag?: boolean;
	isOrder?: boolean;
}

const PageNav: React.FC<Props> = (props) => {
	const {
		currentTitle,
		courseId,
		courseName,
		hasCategoryName,
		isTag,
		isOrder,
	} = props;

	return (
		<Breadcrumb
			fontWeight="medium"
			colorScheme="blue"
			fontSize="sm"
			separator={<Icon as={BiChevronRight} color="gray.500" />}>
			<BreadcrumbItem>
				<BreadcrumbLink
					color="gray.500"
					as={RouterLink}
					to={routes.courses.list}>
					Courses
				</BreadcrumbLink>
			</BreadcrumbItem>
			{courseId && courseName && (
				<BreadcrumbItem>
					<BreadcrumbLink
						color="gray.500"
						as={RouterLink}
						to={routes.courses.edit.replace(':courseId', courseId.toString())}>
						{courseName}
					</BreadcrumbLink>
				</BreadcrumbItem>
			)}

			{courseName && !courseId && (
				<BreadcrumbItem isCurrentPage>
					<BreadcrumbLink>{courseName}</BreadcrumbLink>
				</BreadcrumbItem>
			)}

			{hasCategoryName && (
				<BreadcrumbItem>
					<BreadcrumbLink
						color="gray.500"
						as={RouterLink}
						to={routes.course_categories.list}>
						{__('Categories', 'masteriyo')}
					</BreadcrumbLink>
				</BreadcrumbItem>
			)}

			{isTag && (
				<BreadcrumbItem>
					<BreadcrumbLink
						color="gray.500"
						as={RouterLink}
						to={routes.course_tags.list}>
						{__('Tags', 'masteriyo')}
					</BreadcrumbLink>
				</BreadcrumbItem>
			)}

			{isOrder && (
				<BreadcrumbItem>
					<BreadcrumbLink
						color="gray.500"
						as={RouterLink}
						to={routes.orders.list}>
						{__('Orders', 'masteriyo')}
					</BreadcrumbLink>
				</BreadcrumbItem>
			)}
			<BreadcrumbItem isCurrentPage>
				<BreadcrumbLink color="blue.600">{currentTitle}</BreadcrumbLink>
			</BreadcrumbItem>
		</Breadcrumb>
	);
};

export default PageNav;
