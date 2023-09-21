import type * as express from 'express';
import isErrorThrower from '../../global/helpers/errorCheckers/isErrorThrower';
import { isFirebaseError } from '../../global/helpers/errorCheckers/isFirebaseError';
import handleErrorThrower from '../../global/helpers/errorHandlers/handleErrorThrower';
import handleFirebaseError from '../../global/helpers/errorHandlers/handleFirebaseError';
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
		const { userDeleted, error: delErr } = await deleteUser(reqBody.email);

		if (!userDeleted) {
			return res.status(resCodes.INTERNAL_SERVER.code).send(delErr);
		}

		if (isFirebaseError(err)) {
			return handleFirebaseError(err, res);
		}

		if (isErrorThrower(err)) {
			return handleErrorThrower(err, res);
		}
		return res
			.status(resCodes.INTERNAL_SERVER.code)
			.send(`Error creating new user : ${err}`);
	}
}
