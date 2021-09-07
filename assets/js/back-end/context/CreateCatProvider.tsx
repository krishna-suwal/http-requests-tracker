import React, { createContext, useMemo, useState } from 'react';

export const CreateCatModal = createContext<{
	isCreateCatModalOpen: boolean;
	setIsCreateCatModalOpen?: any;
}>({ isCreateCatModalOpen: false });

const CreateCatModalProvicer: React.FC = ({ children }) => {
	const [isCreateCatModalOpen, setIsCreateCatModalOpen] = useState(false);
	const providerValue = useMemo(
		() => ({
			isCreateCatModalOpen: isCreateCatModalOpen,
			setIsCreateCatModalOpen: setIsCreateCatModalOpen,
		}),
		[isCreateCatModalOpen, setIsCreateCatModalOpen]
	);

	return (
		<CreateCatModal.Provider value={providerValue}>
			{children}
		</CreateCatModal.Provider>
	);
};

export default CreateCatModalProvicer;
