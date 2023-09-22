//TODO: need to create unit tests for each of these 'is' functions in the errorChecker folder

import ErrorThrower from '../../interface/ErrorThrower';

export default function isErrorThrower(error: unknown): error is ErrorThrower {
   return error instanceof ErrorThrower;
}
