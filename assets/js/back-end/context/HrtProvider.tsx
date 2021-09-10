import React, { createContext, useMemo, useState } from 'react';

export const HrtContext = createContext<{
	mtoOptions: any;
	setMtoOptions?: any;
}>({ mtoOptions: null });

const HrtProvider: React.FC = ({ children }) => {
	const [mtoOptions, setMtoOptions] = useState<any>({});
	const providerValue = useMemo(
		() => ({
			mtoOptions: mtoOptions,
			setMtoOptions: setMtoOptions,
		}),
		[mtoOptions, setMtoOptions]
	);

	return (
		<HrtContext.Provider value={providerValue}>{children}</HrtContext.Provider>
	);
};

export default HrtProvider;
