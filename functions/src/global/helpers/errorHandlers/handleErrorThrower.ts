import type * as express from 'express';
import type ErrorThrower from '../../interface/ErrorThrower';
import { resCodes } from '../../utils/resCode';
import ObjectOfObjects from '../dataTypes/objectOfObjects/objectOfObjects';
import { isHelperError } from '../errorCheckers/isHelperError';

export default function handleErrorThrowerMsg(
   error: ErrorThrower,
   res: express.Response<string>,
): express.Response {
   const foundCode = ObjectOfObjects.findObjectByKeyValue(resCodes, 'code', error.resCode);

   if (isHelperError(foundCode)) {
      return res
         .status(resCodes.INTERNAL_SERVER.code)
         .send(`${resCodes.INTERNAL_SERVER.prefix}: Invalid resCode Thrown`);
   }
   return res
      .status(error.resCode)
      .send(`${(foundCode as typeof resCodes.NOT_FOUND).prefix}: ${error.message}`);
}
