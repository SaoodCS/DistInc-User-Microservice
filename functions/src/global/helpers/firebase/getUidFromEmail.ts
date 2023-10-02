import ErrorThrower from '../../interface/ErrorThrower';
import auth from '../../utils/auth';
import { resCodes } from '../../utils/resCode';

interface IGetUidFromEmailReturn {
   uid?: string;
   error?: unknown;
}

export default async function getUidFromEmail(userEmail: string): Promise<IGetUidFromEmailReturn> {
   try {
      const user = await auth.getUserByEmail(userEmail);
      if (!user) {
         throw new ErrorThrower('User not found', resCodes.NOT_FOUND.code);
      }
      const { uid } = user;

      return {
         uid,
      };
   } catch (e: unknown) {
      return {
         error: e,
      };
   }
}
