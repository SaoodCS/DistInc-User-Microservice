import * as express from 'express';
import * as functions from 'firebase-functions';
import Middleware from './global/middleware/Middleware';
import registerUser from './registerUser/endpoint/endpoint';

const app = express();
Middleware.initAdminSDK();
app.use(Middleware.corsSetup);
app.use(Middleware.verifyHeaders);
app.use(Middleware.verifyApiKey);

// API Endpoints:
app.post('/registerUser', registerUser);

// Export to Firebase Cloud Functions:
const userService = functions.https.onRequest(app);
export { userService };
