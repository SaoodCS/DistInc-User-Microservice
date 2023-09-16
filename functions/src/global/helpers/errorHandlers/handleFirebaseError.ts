import type * as express from 'express';
import type { FirebaseError } from 'firebase-admin';
import { resCodes } from '../../utils/resCode';

const firebaseErrorCodeToMessage: Record<string, string> = {
	'auth/email-already-exists': 'Email already exists',
	'auth/invalid-email': 'Invalid email',
	'auth/invalid-password': 'Invalid password',
	'auth/id-token-expired': 'Token expired',
	'auth/user-not-found': 'User not found',
	'auth/wrong-password': 'Wrong password',
	'auth/invalid-verification-code': 'Invalid verification code',
	'auth/invalid-verification-id': 'Invalid verification ID',
	'auth/missing-verification-code': 'Missing verification code',
	'auth/missing-verification-id': 'Missing verification ID',
	'auth/invalid-credential': 'Invalid credential',
};

export default function handleFirebaseError(
	error: FirebaseError,
	res: express.Response<string>,
): express.Response {
	let constructedMsg: string;
	if (error.code in firebaseErrorCodeToMessage) {
		constructedMsg = firebaseErrorCodeToMessage[error.code];
	} else {
		constructedMsg = error.message;
	}
	return res.status(resCodes.BAD_REQUEST.code).send(constructedMsg);
}
