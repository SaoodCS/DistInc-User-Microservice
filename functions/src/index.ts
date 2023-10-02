import * as express from 'express';
import * as functions from 'firebase-functions';
import deleteUser from './deleteUser/endpoint/endpoint';
import Middleware from './global/middleware/Middleware';
import registerUser from './registerUser/endpoint/endpoint';
import resetUser from './resetUser/endpoint/endpoint';

const app = express();
Middleware.initAdminSDK();
app.use(Middleware.corsSetup);
app.use(Middleware.verifyHeaders);
app.use(Middleware.verifyApiKey);

// API Endpoints:
app.post('/registerUser', registerUser);
app.post('/deleteUser', deleteUser);
app.post('/resetUser', resetUser);

// Export to Firebase Cloud Functions:
const userService = functions.https.onRequest(app);
export { userService };
