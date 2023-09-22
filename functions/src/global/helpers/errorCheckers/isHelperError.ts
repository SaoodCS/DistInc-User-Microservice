import type IHelperError from '../../interface/IHelperError';

export function isHelperError(result: unknown): result is IHelperError {
   const resultContainsErrorProp = (result as { error: string }).error !== undefined;
   const resultContainsOtherProps = Object.keys(result as object).length > 1;

   if (resultContainsErrorProp && !resultContainsOtherProps) {
      return true;
   }
   return false;
}
