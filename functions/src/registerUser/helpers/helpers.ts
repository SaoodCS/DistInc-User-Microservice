import auth from '../../global/utils/auth';
import firestore from '../../global/utils/firestore';

interface IDeleteUserReturn {
	userDeleted: boolean;
	error?: unknown;
}

export default async function deleteUser(
	userEmail: string,
): Promise<IDeleteUserReturn> {
	try {
		const user = await auth.getUserByEmail(userEmail);
		if (!user) {
			return {
				userDeleted: true,
			};
		}

		const { uid } = user;

		await auth.deleteUser(user.uid);

		const collections = await firestore.listCollections();
		const batch = firestore.batch();
		collections.forEach((collection) => {
			const docRef = collection.doc(uid);
			batch.delete(docRef);
		});

		await batch.commit();

		return {
			userDeleted: true,
		};
	} catch (e: unknown) {
		return {
			userDeleted: false,
			error: e,
		};
	}
}
