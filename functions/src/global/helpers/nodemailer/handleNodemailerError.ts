export default function handleNodemailerError(error: Error): string {
   if (error.message.includes('Invalid login')) {
      return 'Nodemailer: Invalid login credentials';
   }
   if (error.message.includes('Invalid email address')) {
      return 'Nodemailer: Invalid email address';
   }
   if (error.message.includes('Invalid password')) {
      return 'Nodemailer: Invalid password';
   }
   return error.message;
}
