import type * as express from 'express';
import ErrorThrower from '../../global/interface/ErrorThrower';
import { resCodes } from '../../global/utils/resCode';
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
	} catch (err) {
		// Error handling code for caught errors here
	}
	return res.status(200).send({ message: 'Empty Cloud Function' });
}
