import { isValidEmail } from './isValidEmail';

describe('isValidEmail', () => {
	it('should return true if a valid email is passed through ', () => {
		const email = 'test.email@hotmail.com';
		const result = isValidEmail(email);
		expect(result).toBe(true);
	});

	it('should return false if an invalid email is passed through ', () => {
		const email = 'test.email';
		const result = isValidEmail(email);
		expect(result).toBe(false);
	});
});
