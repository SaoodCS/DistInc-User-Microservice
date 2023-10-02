import firestore from '../../utils/firestore';

interface IDeleteUserDataReturn {
   userDataDeleted: boolean;
   error?: unknown;
}

export default async function deleteUserData(uid: string): Promise<IDeleteUserDataReturn> {
   try {
      const collections = await firestore.listCollections();
      const batch = firestore.batch();
      collections.forEach((collection) => {
         const docRef = collection.doc(uid);
         batch.delete(docRef);
      });
      await batch.commit();
      return {
         userDataDeleted: true,
      };
   } catch (e: unknown) {
      return {
         userDataDeleted: false,
         error: e,
      };
   }
}
