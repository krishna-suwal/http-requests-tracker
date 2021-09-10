import { useState } from 'react';

export default function useArray(defaultValue: Array<any>) {
	const [array, setArray] = useState<Array<any>>(defaultValue);

	function push(element: any) {
		setArray((a: Array<any>) => [...a, element]);
	}

	function filter(callback: (value: any) => value is any) {
		setArray((a: Array<any>) => a.filter(callback));
	}

	function update(index: number, newElement: any) {
		setArray((a: Array<any>) => [
			...a.slice(0, index),
			newElement,
			...a.slice(index + 1, a.length - 1),
		]);
	}

	function remove(index: number) {
		setArray((a: Array<any>) => [
			...a.slice(0, index),
			...a.slice(index + 1, a.length - 1),
		]);
	}

	function clear() {
		setArray([]);
	}

	return { array, set: setArray, push, filter, update, remove, clear };
}
