export interface IUserRegReqBody {
   email: string;
   password: string;
}

export default class UserRegReqBody {
   static isValid(body: unknown): body is IUserRegReqBody {
      if (typeof body !== 'object' || body === null) return false;

      const { email, password } = body as IUserRegReqBody;

      if (typeof email !== 'string') return false;
      if (typeof password !== 'string') return false;

      return true;
   }
}
