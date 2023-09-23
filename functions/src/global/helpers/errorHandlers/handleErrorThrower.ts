import type * as express from 'express';
import type ErrorThrower from '../../interface/ErrorThrower';
import type IObjWithErrProp from '../../interface/IObjWithErrProp';
import { resCodes } from '../../utils/resCode';
import ObjectOfObjects from '../dataTypes/objectOfObjects/objectOfObjects';
import { hasErrorProp } from '../errorCheckers/hasErrorProp';

export default function handleErrorThrowerMsg(
   error: ErrorThrower,
   res: express.Response<IObjWithErrProp>,
): express.Response {
   const foundCode = ObjectOfObjects.findObjectByKeyValue(resCodes, 'code', error.resCode);

   if (hasErrorProp(foundCode)) {
      return res
         .status(resCodes.INTERNAL_SERVER.code)
         .send({ error: `${resCodes.INTERNAL_SERVER.prefix}: Invalid resCode Thrown` });
   }
   return res
      .status(error.resCode)
      .send({ error: `${(foundCode as typeof resCodes.NOT_FOUND).prefix}: ${error.message}` });
}
