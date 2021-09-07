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
import { BiCopy, BiPlus, BiTrash } from 'react-icons/bi';
import { Sortable } from '../../../../../assets/icons';
import { sectionHeaderStyles } from '../../../../../config/styles';
import { QuestionContext } from '../../../../../context/QuestionProvider';
import { duplicateObject, existsOnArray } from '../../../../../utils/utils';
import EditableAnswer from '../EditableAnswer';

interface Props {
	answersData?: any;
}

const MultipleChoice: React.FC<Props> = (props) => {
	const { answersData } = props;
	const { register, setValue } = useFormContext();
	const [answers, setAnswers] = useState<any>(answersData || []);
	const { setSubmitQuestionDisabled } = useContext(QuestionContext);

	const iconStyles = {
		fontSize: 'x-large',
		color: 'gray.500',
		minW: 'auto',
		_hover: { color: 'blue.500' },
	};

	const onAddNewAnswerPress = () => {
		var newAnswers = [...answers];
		setAnswers([
			...newAnswers,
			{
				name: 'new answer ' + newAnswers.length,
				correct: newAnswers.length === 0 ? true : false,
			},
		]);
	};

	const onDeletePress = (id: any) => {
		var newAnswers = [...answers];
		newAnswers.splice(id, 1);
		setAnswers(newAnswers);
	};

	const onCheckPress = (id: any, correct: boolean) => {
		var newAnswers = [...answers];
		newAnswers.splice(id, 1, { ...newAnswers[id], correct: correct });
		setAnswers(newAnswers);
	};

	const onDuplicatePress = (name: string) => {
		var newAnswers = [...answers];
		setAnswers([...newAnswers, { name: name, correct: false }]);
	};

	useEffect(() => {
		setValue('answers', answers);
		setSubmitQuestionDisabled(duplicateObject('name', answers) ? true : false);
		setSubmitQuestionDisabled(
			existsOnArray(answers, 'correct', true) ? false : true
		);
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
				{!existsOnArray(answers, 'correct', true) && (
					<Alert status="error" mb="4" fontSize="xs" p="2">
						<AlertIcon />
						<AlertTitle mr={2}>
							{__('No answer checked', 'masteriyo')}
						</AlertTitle>
						<AlertDescription>
							{__('Please check at least one answer', 'masteriyo')}
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
										index={index}
										defaultValue={answer.name}
										answers={answers}
										setAnswers={setAnswers}
									/>
								</Stack>
								<Stack direction="row" spacing="4" flexWrap="wrap">
									<Checkbox
										colorScheme="green"
										isChecked={answer?.correct}
										onChange={(e) => onCheckPress(index, e.target.checked)}
									/>
									<Stack direction="row" spacing="2">
										<IconButton
											variant="unstyled"
											sx={iconStyles}
											aria-label={__('Duplicate', 'masteriyo')}
											onClick={() => onDuplicatePress(answer.name)}
											icon={<BiCopy />}
										/>
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
					onClick={onAddNewAnswerPress}>
					Add New Answer
				</Button>
			</ButtonGroup>
		</Stack>
	);
};

export default MultipleChoice;
