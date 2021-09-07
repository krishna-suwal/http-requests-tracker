import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	ButtonGroup,
	Checkbox,
	Flex,
	Heading,
	Icon,
	IconButton,
	Input,
	Stack,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React, { useContext, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { BiPlus, BiTrash } from 'react-icons/bi';
import { Sortable } from '../../../../../assets/icons';
import { sectionHeaderStyles } from '../../../../../config/styles';
import { QuestionContext } from '../../../../../context/QuestionProvider';
import { duplicateObject } from '../../../../../utils/utils';
import EditableAnswer from '../EditableAnswer';

interface Props {
	answersData?: any;
}

const TrueFalse: React.FC<Props> = (props) => {
	const { answersData } = props;
	const { register, setValue } = useFormContext();
	const { setSubmitQuestionDisabled } = useContext(QuestionContext);
	const [answers, setAnswers] = useState<any>(
		answersData || [
			{ name: 'True', correct: true },
			{ name: 'False', correct: false },
		]
	);
	const iconStyles = {
		fontSize: 'x-large',
		color: 'gray.500',
		minW: 'auto',
		_hover: { color: 'blue.500' },
	};

	const onAddNewAnswerPress = () => {
		var newAnswers = [...answers];
		if (newAnswers.length < 2) {
			setAnswers([...newAnswers, { name: 'new answer', correct: false }]);
		}
	};

	const onDeletePress = (id: any) => {
		var newAnswers = [...answers];
		newAnswers.splice(id, 1);
		setAnswers(newAnswers);
	};

	const onCheckPress = (id: any) => {
		var newAnswers = [...answers];

		// uncheck other checkbox
		for (var key in newAnswers) {
			newAnswers[key] = { ...newAnswers[key], correct: false };
		}

		newAnswers.splice(id, 1, { ...newAnswers[id], correct: true });
		setAnswers(newAnswers);
	};

	useEffect(() => {
		setValue('answers', answers);
		setSubmitQuestionDisabled(duplicateObject('name', answers) ? true : false);
	}, [answers, setValue, setSubmitQuestionDisabled]);

	return (
		<Stack direction="column" spacing="6">
			<Flex sx={sectionHeaderStyles}>
				<Heading fontSize="lg" fontWeight="semibold">
					{__('Answers', 'masteriyo')}
				</Heading>
			</Flex>
			<Input type="hidden" {...register('answers')} />
			<Box>
				{duplicateObject('name', answers) && (
					<Alert status="error" mb="4" fontSize="xs" p="2">
						<AlertIcon />
						<AlertTitle mr={2}>{__('Duplicate Names', 'masteriyo')}</AlertTitle>
						<AlertDescription>
							{__('Answer can not be duplicate', 'masteriyo')}
						</AlertDescription>
					</Alert>
				)}
				{answers &&
					answers.map(
						(answer: { name: string; correct: boolean }, index: number) => (
							<Flex
								key={index}
								border="1px"
								borderColor={answer?.correct ? 'green.200' : 'gray.100'}
								rounded="sm"
								mb="4"
								align="center"
								justify="space-between"
								px="2"
								py="1">
								<Stack direction="row" spacing="2" align="center" flex="1">
									<Icon as={Sortable} fontSize="lg" color="gray.500" />
									<EditableAnswer
										answers={answers}
										index={index}
										setAnswers={setAnswers}
										defaultValue={answer.name}
									/>
								</Stack>

								<Stack direction="row" spacing="4">
									<Checkbox
										colorScheme="green"
										isChecked={answer?.correct}
										onChange={() => onCheckPress(index)}
									/>
									<Stack direction="row" spacing="2">
										<IconButton
											variant="unstyled"
											sx={iconStyles}
											aria-label={__('Delete', 'masteriyo')}
											icon={<BiTrash />}
											minW="auto"
											onClick={() => onDeletePress(index)}
										/>
									</Stack>
								</Stack>
							</Flex>
						)
					)}
			</Box>
			<ButtonGroup>
				<Button
					leftIcon={<Icon as={BiPlus} fontSize="xl" />}
					variant="link"
					color="gray.900"
					isDisabled={answers.length > 1}
					onClick={onAddNewAnswerPress}>
					{__('Add New Answer', 'masteriyo')}
				</Button>
			</ButtonGroup>
		</Stack>
	);
};

export default TrueFalse;
