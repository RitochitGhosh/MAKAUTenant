import express from 'express';
import { 
    deleteUserController,
    googleAuthenticationController,
    signinController, 
    signoutController, 
    signupController 
} from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const authRouter = express.Router();

authRouter.post("/sign-up", signupController);
authRouter.post("/sign-in", signinController);
authRouter.post("/sign-out", signoutController);
authRouter.post("/google", googleAuthenticationController);
authRouter.delete("/delete/:id", verifyToken, deleteUserController);
// authRouter.post("/verify-email", ); // TODO: only verified users can add property
// authRouter.post("/reset-password", );

export default authRouter;