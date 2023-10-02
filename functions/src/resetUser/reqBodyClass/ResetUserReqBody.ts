export interface IResetUserReqBody {
   email: string;
}

export default class ResetUserReqBody {
   static isValid(body: unknown): body is IResetUserReqBody {
      if (typeof body !== 'object' || body === null) return false;
      const { email } = body as IResetUserReqBody;
      if (typeof email !== 'string') return false;
      return true;
   }
}
