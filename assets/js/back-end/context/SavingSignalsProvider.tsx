import React, { createContext, useState } from 'react';

export const SavingSignalsContext = createContext<[any, any]>([{}, () => {}]);

const SavingSignalsProvider: React.FC = ({ children }) => {
	const [isSaving, setIsSaving] = useState({});

	return (
		<SavingSignalsContext.Provider value={[isSaving, setIsSaving]}>
			{children}
		</SavingSignalsContext.Provider>
	);
};

export default SavingSignalsProvider;
