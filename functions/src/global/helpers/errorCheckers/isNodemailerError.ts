export function isNodemailerError(error: unknown): error is Error {
   if (error instanceof Error) {
      return true;
   }
   return false;
}
