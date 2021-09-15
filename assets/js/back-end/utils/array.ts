export const updateArrayItemObj = (
	key: string,
	value: any,
	valuesToUpdate: any,
	list: JSON[]
) => {
	const index = list.findIndex((item) => item[key] === value);

	if (index < 0) {
		return list;
	}
	const newList = [...list];

	newList[index] = {
		...list[index],
		...valuesToUpdate,
	};
	return newList;
};

export const removeArrayItemObjBy = (key: string, value: any, list: any[]) => {
	return list.filter((item) => item[key] !== value);
};

export const removeArrayItem = (index: number, list: any[]) => {
	return list.filter((_, i) => i !== index);
};
