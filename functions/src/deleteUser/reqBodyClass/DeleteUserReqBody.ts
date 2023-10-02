export interface IDeleteUserReqBody {
   email: string;
   password: string;
}

export default class DeleteUserReqBody {
   static isValid(body: unknown): body is IDeleteUserReqBody {
      if (typeof body !== 'object' || body === null) return false;

      const { email, password } = body as IDeleteUserReqBody;

      if (typeof email !== 'string') return false;
      if (typeof password !== 'string') return false;

      return true;
   }
}
