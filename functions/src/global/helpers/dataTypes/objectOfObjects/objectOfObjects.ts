import type HelperError from '../../../interface/IHelperError';

export default class ObjectOfObjects {
   static findObjectByKeyValue<T, K extends keyof T>(
      object: Record<string, T>,
      key: K,
      value: T[K],
   ): T | HelperError {
      const errorObj: HelperError = {
         error: `findObjectByKeyValue: No object found with key '${String(
            key,
         )}' and value '${value}'`,
      };
      return Object.values(object).find((obj: T) => obj[key] === value) || errorObj;
   }
}
