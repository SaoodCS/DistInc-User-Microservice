import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorCheckers';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
import deleteUserData from '../../global/helpers/firebase/deleteUserData';
import getUidFromEmail from '../../global/helpers/firebase/getUidFromEmail';
import setUserData from '../../global/helpers/firebase/setUserData';
import ErrorThrower from '../../global/interface/ErrorThrower';
import { resCodes } from '../../global/utils/resCode';
import ResetUserReqBody from '../reqBodyClass/ResetUserReqBody';

export default async function resetUser(
   req: express.Request,
   res: express.Response,
): Promise<express.Response> {
   const reqBody = req.body;
   try {
      if (!ResetUserReqBody.isValid(reqBody)) {
         throw new ErrorThrower('Invalid Body Request', resCodes.BAD_REQUEST.code);
      }

      const { uid } = await getUidFromEmail(reqBody.email);
      if (uid) {
         const { userDataDeleted, error: dataDelErr } = await deleteUserData(uid);
         if (!userDataDeleted) {
            throw new ErrorThrower(JSON.stringify(dataDelErr), resCodes.INTERNAL_SERVER.code);
         }
         const { userDataSetted, error: dataSetErr } = await setUserData(uid, reqBody.email);
         if (!userDataSetted) {
            throw new ErrorThrower(JSON.stringify(dataSetErr), resCodes.INTERNAL_SERVER.code);
         }
      }

      return res.status(200).send({ message: "Successfully Reset User's Account" });
   } catch (error: unknown) {
      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }
      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
