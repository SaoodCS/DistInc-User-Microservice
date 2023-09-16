export interface IUserRegReqBody {
	name: string;
	email: string;
	password: string;
}

export default class UserRegReqBody {
	static isValid(body: unknown): body is IUserRegReqBody {
		if (typeof body !== 'object' || body === null) return false;

		const { name, email, password } = body as IUserRegReqBody;

		if (typeof name !== 'string') return false;
		if (typeof email !== 'string') return false;
		if (typeof password !== 'string') return false;

		return true;
	}
}
