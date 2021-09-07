import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	Heading,
	Image,
	Link,
	List,
	ListIcon,
	ListItem,
	Stack,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { ReactElement } from 'react';
import { BiBook, BiCog, BiEdit } from 'react-icons/bi';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { navActiveStyles, navLinkStyles } from '../../config/styles';
import { Logo } from '../../constants/images';
import routes from '../../constants/routes';
import useCourse from '../../hooks/useCourse';

interface Props {
	firstBtn?: {
		label: string;
		action: () => void;
		isDisabled?: boolean;
		isLoading?: boolean;
	};
	secondBtn?: {
		label: string;
		action: () => void;
		isDisabled?: boolean;
		isLoading?: boolean;
	};
	thirdBtn?: {
		label: string;
		action: () => void;
		isDisabled?: boolean;
		isLoading?: boolean;
		icon?: ReactElement;
	};
	course?: {
		name: string;
		id: number;
	};
	showLinks?: boolean;
	showPreview?: boolean;
	showCourseName?: boolean;
}

const Header: React.FC<Props> = (props) => {
	const {
		firstBtn,
		secondBtn,
		thirdBtn,
		course,
		children,
		showLinks,
		showPreview,
		showCourseName,
	} = props;
	const courseDetail = useCourse();
	const location = useLocation();
	const { courseId }: any = useParams();
	return (
		<Box bg="white" w="full" shadow="header">
			<Container maxW="container.xl" bg="white">
				<Flex direction="row" justifyContent="space-between" align="center">
					<Stack direction="row" spacing="8" align="center" minHeight="16">
						<NavLink to={routes.courses.list}>
							<Image src={Logo} w="36px" />
						</NavLink>
						{showCourseName && (
							<>
								{course && (
									<Heading fontSize="md" fontWeight="medium">
										{course.name}
									</Heading>
								)}
								{!course && courseDetail.courseName && (
									<Heading fontSize="md" fontWeight="medium">
										{courseDetail.courseName}
									</Heading>
								)}
							</>
						)}
						{children}
						{showLinks && courseId && (
							<List d="flex">
								<ListItem mb="0">
									<Link
										as={NavLink}
										sx={navLinkStyles}
										_activeLink={navActiveStyles}
										to={routes.courses.edit.replace(
											':courseId',
											courseId.toString()
										)}>
										<ListIcon as={BiBook} />
										{__('Course', 'masteriyo')}
									</Link>
								</ListItem>

								<ListItem mb="0">
									<Link
										as={NavLink}
										sx={navLinkStyles}
										isActive={() => location.pathname.includes('/courses')}
										_activeLink={navActiveStyles}
										to={
											routes.courses.edit.replace(
												':courseId',
												courseId.toString()
											) + '?page=builder'
										}>
										<ListIcon as={BiEdit} />
										{__('Builder', 'masteriyo')}
									</Link>
								</ListItem>

								<ListItem mb="0">
									<Link
										as={NavLink}
										sx={navLinkStyles}
										_activeLink={navActiveStyles}
										to={
											routes.courses.edit.replace(
												':courseId',
												courseId.toString()
											) + '?page=settings'
										}>
										<ListIcon as={BiCog} />
										{__('Settings', 'masteriyo')}
									</Link>
								</ListItem>
							</List>
						)}
					</Stack>

					<ButtonGroup>
						{firstBtn && (
							<Button
								variant="outline"
								onClick={firstBtn.action}
								isLoading={firstBtn.isLoading}
								isDisabled={firstBtn.isDisabled}>
								{firstBtn.label}
							</Button>
						)}

						{showPreview && courseDetail.previewUrl && (
							<Link href={courseDetail.previewUrl} isExternal>
								<Button variant="outline">{__('Preview', 'masteriyo')}</Button>
							</Link>
						)}
						{secondBtn && (
							<Button
								variant="outline"
								colorScheme="blue"
								onClick={secondBtn.action}
								isDisabled={secondBtn.isDisabled}
								isLoading={secondBtn.isLoading}>
								{secondBtn.label}
							</Button>
						)}

						{thirdBtn && (
							<Button
								colorScheme="blue"
								onClick={thirdBtn.action}
								isDisabled={thirdBtn.isDisabled}
								leftIcon={thirdBtn.icon}
								isLoading={thirdBtn.isLoading}>
								{thirdBtn.label}
							</Button>
						)}
					</ButtonGroup>
				</Flex>
			</Container>
		</Box>
	);
};

export default Header;
