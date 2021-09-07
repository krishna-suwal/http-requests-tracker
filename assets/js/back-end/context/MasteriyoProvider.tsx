import React, { createContext, useMemo, useState } from 'react';

export const MasteriyoContext = createContext<{
	mtoOptions: any;
	setMtoOptions?: any;
}>({ mtoOptions: null });

const MasteriyoProvider: React.FC = ({ children }) => {
	const [mtoOptions, setMtoOptions] = useState<any>({});
	const providerValue = useMemo(
		() => ({
			mtoOptions: mtoOptions,
			setMtoOptions: setMtoOptions,
		}),
		[mtoOptions, setMtoOptions]
	);

	return (
		<MasteriyoContext.Provider value={providerValue}>
			{children}
		</MasteriyoContext.Provider>
	);
};

export default MasteriyoProvider;
