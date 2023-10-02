import type * as express from 'express';
import ErrorChecker from '../../global/helpers/errorCheckers/ErrorCheckers';
import ErrorHandler from '../../global/helpers/errorHandlers/ErrorHandler';
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
      return res.status(200).send({ message: 'Empty Cloud Function' });
   } catch (error: unknown) {
      // Error handling code for caught errors here

      if (ErrorChecker.isErrorThrower(error)) {
         return ErrorHandler.handleErrorThrower(error, res);
      }

      return res.status(resCodes.INTERNAL_SERVER.code).send({ error: error });
   }
}
