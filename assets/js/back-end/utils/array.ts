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
