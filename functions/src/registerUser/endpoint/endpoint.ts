import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorCheckers';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import deleteUserData from '../../global/helpers/firebase/deleteUserData';
import getUidFromEmail from '../../global/helpers/firebase/getUidFromEmail';
import ErrorThrower from '../../global/interface/ErrorThrower';
import CollectionRef from '../../global/utils/CollectionRef';
import auth from '../../global/utils/auth';
import { resCodes } from '../../global/utils/resCode';
import UserRegReqBody from '../reqBodyClass/UserRegReqBody';
import deleteUserAccount from '../../global/helpers/firebase/deleteUserAccount';

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
      const { uid } = await getUidFromEmail(reqBody.email);
      if (uid) {
         const { userDataDeleted, error: dataDelErr } = await deleteUserData(uid);
         if (!userDataDeleted) {
            return res.status(resCodes.INTERNAL_SERVER.code).send({ error: dataDelErr });
         }
         const { userDeleted, error: delErr } = await deleteUserAccount(reqBody.email);
         if (!userDeleted) {
            return res.status(resCodes.INTERNAL_SERVER.code).send({ error: delErr });
         }
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
