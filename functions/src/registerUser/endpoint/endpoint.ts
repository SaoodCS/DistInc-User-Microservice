import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorCheckers';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import auth from '../../global/utils/auth';
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
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }

      const userRecord = await auth.createUser({
         email: reqBody.email,
         password: reqBody.password,
      });
      const { uid } = userRecord;

      await CollectionRef.userDetails.doc(uid).set({
         email: reqBody.email,
      });

      return res.status(resCodes.OK.code).send({ message: 'User registered successfully' });
   } catch (err: unknown) {
      if (ErrorChecker.isFirebaseError(err) && err.code === 'auth/email-already-exists') {
         return res.status(resCodes.CONFLICT.code).send({ error: 'Email already exists' });
      }
      const { userDeleted, error: delErr } = await deleteUser(reqBody.email);

      if (!userDeleted) {
         return res.status(resCodes.INTERNAL_SERVER.code).send({ error: delErr });
      }

      if (ErrorChecker.isFirebaseError(err)) {
         return ErrorHandler.handleFirebaseError(err, res);
      }

      if (ErrorChecker.isErrorThrower(err)) {
         return ErrorHandler.handleErrorThrower(err, res);
      }
      return res
         .status(resCodes.INTERNAL_SERVER.code)
         .send({ error: `Error creating new user : ${err}` });
   }
}
