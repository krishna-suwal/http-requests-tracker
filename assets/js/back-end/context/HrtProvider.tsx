import React, { createContext, useMemo, useState } from 'react';

export const HrtContext = createContext<{
	hrtOptions: any;
	setHrtOptions?: any;
}>({ hrtOptions: null });

const HrtProvider: React.FC = ({ children }) => {
	const [hrtOptions, setHrtOptions] = useState<any>({});
	const providerValue = useMemo(
		() => ({
			hrtOptions: hrtOptions,
			setHrtOptions: setHrtOptions,
		}),
		[hrtOptions, setHrtOptions]
	);

	return (
		<HrtContext.Provider value={providerValue}>{children}</HrtContext.Provider>
	);
};

export default HrtProvider;
