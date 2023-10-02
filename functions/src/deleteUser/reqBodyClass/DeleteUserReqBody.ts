export interface IDeleteUserReqBody {
   email: string;
}

export default class DeleteUserReqBody {
   static isValid(body: unknown): body is IDeleteUserReqBody {
      if (typeof body !== 'object' || body === null) return false;
      const { email } = body as IDeleteUserReqBody;
      if (typeof email !== 'string') return false;
      return true;
   }
}
