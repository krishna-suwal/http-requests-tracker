import { useContext } from 'react';
import { SavingSignalsContext } from '../context/SavingSignalsProvider';

interface SaveHandlerType {
	(arg1: SaveHandlerArgsType): void;
}
interface SaveHandlerArgsType {
	data: any;
	saving: Function;
	savingComplete: Function;
}

const saveHandlers = {};
const isSavingCounters = {};

export const useRegisterSaveHandler = (
	name: string,
	handler: SaveHandlerType
) => {
	saveHandlers[name] = handler;
};

export const useSaver = (name: string) => {
	const [isSaving, setIsSaving] = useContext(SavingSignalsContext);

	const saving = () => {
		isSavingCounters[name] =
			(isSavingCounters[name] === undefined ? 0 : isSavingCounters[name]) + 1;

		setIsSaving((obj: {}) => {
			return { ...obj, [name]: true };
		});
	};
	const savingComplete = () => {
		isSavingCounters[name] =
			(isSavingCounters[name] === undefined ? 0 : isSavingCounters[name]) - 1;

		if (isSavingCounters[name] > 0) {
			return;
		}

		setIsSaving((obj: {}) => {
			return { ...obj, [name]: false };
		});
	};
	const save = (data: any) => {
		if (!saveHandlers[name]) {
			return;
		}
		saving();
		saveHandlers[name]({ data, saving, savingComplete });
	};

	return {
		isSaving: !!isSaving[name],
		saving,
		savingComplete,
		save,
	};
};

export const useSavers = (saverNames: string[]) => {
	const [isSaving] = useContext(SavingSignalsContext);
	const isSavingStates = saverNames.map((name) =>
		isSaving[name] ? true : false
	);

	return {
		isAllSaved: !isSavingStates.includes(true),
		isSaving: isSavingStates.includes(true),
	};
};

export const useAllSaver = () => {
	const [isSaving] = useContext(SavingSignalsContext);

	return {
		isSaving: Object.values(isSaving).includes(true),
	};
};
