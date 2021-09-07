import React, { createContext, useMemo, useState } from 'react';

export const QuestionContext = createContext<{
	submitQuestionDisabled: boolean;
	setSubmitQuestionDisabled?: any;
}>({ submitQuestionDisabled: false });

const QuestionProvider: React.FC = ({ children }) => {
	const [submitQuestionDisabled, setSubmitQuestionDisabled] = useState(false);
	const providerValue = useMemo(
		() => ({
			submitQuestionDisabled: submitQuestionDisabled,
			setSubmitQuestionDisabled: setSubmitQuestionDisabled,
		}),
		[submitQuestionDisabled, setSubmitQuestionDisabled]
	);

	return (
		<QuestionContext.Provider value={providerValue}>
			{children}
		</QuestionContext.Provider>
	);
};

export default QuestionProvider;
