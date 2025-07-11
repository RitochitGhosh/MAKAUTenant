import express from 'express';
import { 
    signinController, 
    signoutController, 
    signupController 
} from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter.post("/sign-up", signupController);
authRouter.post("/sign-in", signinController);
authRouter.post("/sign-out", signoutController);
// authRouter.post("/verify-email", ); // TODO: only verified users can add property
// authRouter.post("/reset-password", );

export default authRouter;