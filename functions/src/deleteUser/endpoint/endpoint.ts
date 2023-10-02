import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorCheckers';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import deleteUserAccount from '../../global/helpers/firebase/deleteUserAccount';
import deleteUserData from '../../global/helpers/firebase/deleteUserData';
import getUidFromEmail from '../../global/helpers/firebase/getUidFromEmail';
import ErrorThrower from '../../global/interface/ErrorThrower';
import { resCodes } from '../../global/utils/resCode';
import DeleteUserReqBody from '../reqBodyClass/DeleteUserReqBody';

export default async function deleteUser(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!DeleteUserReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }

      const { uid } = await getUidFromEmail(reqBody.email);
      if (uid) {
         const { userDataDeleted, error: dataDelErr } = await deleteUserData(uid);
         if (!userDataDeleted) {
            throw new ErrorThrower(JSON.stringify(dataDelErr), resCodes.INTERNAL_SERVER.code);
         }
         const { userDeleted, error: delErr } = await deleteUserAccount(reqBody.email);
         if (!userDeleted) {
            throw new ErrorThrower(JSON.stringify(delErr), resCodes.INTERNAL_SERVER.code);
         }
      }

      return res.status(200).send({ message: 'Successfully deleted user' });
   } catch (error: unknown) {
      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }
      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
