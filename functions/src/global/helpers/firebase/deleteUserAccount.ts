import auth from '../../utils/auth';

interface IDeleteUserReturn {
   userDeleted: boolean;
   error?: unknown;
}

export default async function deleteUserAccount(userEmail: string): Promise<IDeleteUserReturn> {
   try {
      const user = await auth.getUserByEmail(userEmail);
      if (!user) {
         return {
            userDeleted: true,
         };
      }

      await auth.deleteUser(user.uid);

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
