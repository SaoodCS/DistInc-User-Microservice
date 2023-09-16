import type IHelperError from '../../../interface/IHelperError';
import { isHelperError } from '../../errorCheckers/isHelperError';

class ArrayOfObjects {
	public static objectsWithVal<T>(
		array: T[],
		propertyValue: T[keyof T],
	): T[] | IHelperError {
		const obj = array.filter((item) => {
			for (const key in item) {
				if (item[key] === propertyValue) {
					return item;
				}
			}
		});
		if (obj.length === 0) {
			return {
				error: `No Objects Found With Val: ${propertyValue}.`,
			};
		}
		return obj;
	}

	static objectWithVal<T>(
		array: T[],
		propertyValue: T[keyof T],
	): T | undefined | { error: string } {
		const object = this.objectsWithVal(array, propertyValue);
		if (isHelperError(object)) return object;
		if (object.length > 1) {
			return {
				error: `Multiple Objects Found With Val: ${propertyValue}.`,
			};
		}
		return object[0];
	}
}

export default ArrayOfObjects;
