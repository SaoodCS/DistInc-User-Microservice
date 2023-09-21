import type * as express from 'express';
import { isFirebaseError } from '../../global/helpers/errorCheckers/isFirebaseError';
import ErrorThrower from '../../global/interface/ErrorThrower';
import auth from '../../global/utils/auth';
import CollectionRef from '../../global/utils/CollectionRef';
import { resCodes } from '../../global/utils/resCode';
import deleteUser from '../helpers/helpers';
import UserRegReqBody from '../reqBodyClass/UserRegReqBody';

export default async function registerUser(
	req: express.Request,
	res: express.Response,
): Promise<express.Response> {
	const reqBody = req.body;
	try {
		if (!UserRegReqBody.isValid(reqBody)) {
			throw new ErrorThrower(
				'Invalid Body Request',
				resCodes.BAD_REQUEST.code,
			);
		}

		const userRecord = await auth.createUser({
			email: reqBody.email,
			password: reqBody.password,
		});
		const { uid } = userRecord;

		await CollectionRef.userDetails.doc(uid).set({
			email: reqBody.email,
			password: reqBody.password,
		});

		return res
			.status(resCodes.OK.code)
			.send({ message: 'User registered successfully' });
	} catch (err: unknown) {
		if (isFirebaseError(err) && err.code === 'auth/email-already-exists') {
			return res.status(resCodes.CONFLICT.code).send({
				message: 'Email already exists',
			});
		}
		const { userDeleted, error } = await deleteUser(reqBody.email);
		return res
			.status(resCodes.INTERNAL_SERVER.code)
			.send(
				`Error creating user: ${err}. Deleted: ${userDeleted} - ${
					error || null
				}`,
			);
	}
}
