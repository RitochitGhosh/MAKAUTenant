import express from 'express';
import { 
    googleAuthenticationController,
    signinController, 
    signoutController, 
    signupController 
} from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/sign-up", signupController);
authRouter.post("/sign-in", signinController);
authRouter.post("/sign-out", signoutController);
authRouter.post("/google", googleAuthenticationController);
// authRouter.post("/verify-email", ); // TODO: only verified users can add property
// authRouter.post("/reset-password", );

export default authRouter;