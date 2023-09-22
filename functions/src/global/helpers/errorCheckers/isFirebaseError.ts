import type { FirebaseError } from 'firebase-admin';

export function isFirebaseError(error: unknown): error is FirebaseError {
   const errorContainsCodeProp = (error as FirebaseError).code !== undefined;
   const errorContainsMessageProp = (error as FirebaseError).message !== undefined;
   if (errorContainsCodeProp && errorContainsMessageProp) {
      return true;
   }
   return false;
}
