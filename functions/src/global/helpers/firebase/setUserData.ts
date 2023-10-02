import CollectionRef from '../../utils/CollectionRef';

interface ISetUserDataReturn {
   userDataSetted: boolean;
   error?: unknown;
}

export default async function setUserData(uid: string, email: string): Promise<ISetUserDataReturn> {
   try {
      await CollectionRef.userDetails.doc(uid).set({
         email,
      });
      return {
         userDataSetted: true,
      };
   } catch (e: unknown) {
      return {
         userDataSetted: false,
         error: e,
      };
   }
}
