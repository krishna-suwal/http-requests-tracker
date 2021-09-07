import {
	Accordion,
	Alert,
	AlertIcon,
	Center,
	Spinner,
	Stack,
} from '@chakra-ui/react';
import { __ } from '@wordpress/i18n';
import React from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import AddNewButton from '../../../../components/common/AddNewButton';
import urls from '../../../../constants/urls';
import QuestionProvider from '../../../../context/QuestionProvider';
import { QuestionSchema } from '../../../../schemas';
import API from '../../../../utils/api';
import Question from './Question';

interface Props {
	quizId: number;
	courseId: number;
}

const Questions: React.FC<Props> = (props) => {
	const { quizId, courseId } = props;

	const questionsAPI = new API(urls.questions);

	const queryClient = useQueryClient();

	const questionQuery = useQuery(
		[`questions${quizId}`, quizId],
		() => questionsAPI.list({ parent: quizId, order: 'asc' }),
		{
			enabled: !!quizId,
		}
	);

	const addQuestion = useMutation(
		(data: QuestionSchema | any) => questionsAPI.store(data),
		{
			onSuccess: () => {
				queryClient.invalidateQueries(`questions${quizId}`);
			},
		}
	);

	const onAddNewQuestionPress = () => {
		addQuestion.mutate({
			name: 'New Question',
			course_id: courseId,
			parent_id: quizId,
			type: 'true-false',
			answers: [
				{
					name: 'True',
					correct: true,
				},
				{
					name: 'False',
					correct: false,
				},
			],
		});
	};

	return (
		<QuestionProvider>
			<Stack direction="column" spacing="6" py="8">
				{questionQuery.isLoading && (
					<Center minH="xs">
						<Spinner />
					</Center>
				)}
				{questionQuery.isSuccess && (
					<>
						{questionQuery.data.length == 0 ? (
							<Alert status="info" fontSize="sm" p="2.5">
								<AlertIcon />
								{__(
									'There are no questions right now, You can add them by clicking on Add New Question',
									'masteriyo'
								)}
							</Alert>
						) : (
							<Accordion allowToggle>
								{questionQuery.data.map((question: any) => (
									<Question key={question.id} questionData={question} />
								))}
							</Accordion>
						)}
						<Center>
							<AddNewButton
								onClick={onAddNewQuestionPress}
								isLoading={addQuestion.isLoading}>
								Add New Question
							</AddNewButton>
						</Center>
					</>
				)}
			</Stack>
		</QuestionProvider>
	);
};

export default Questions;
