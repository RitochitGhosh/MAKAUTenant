import express from 'express';
import { 
    confirmEmail,
    deleteUserController,
    googleAuthenticationController,
    resetPassword,
    sendResetPasswordEmail,
    sendVerificationEmail,
    signinController, 
    signoutController, 
    signupController 
} from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const authRouter = express.Router();

authRouter.post("/sign-up", signupController);
authRouter.post("/sign-in", signinController);
authRouter.post("/sign-out", verifyToken, signoutController);
authRouter.post("/google", googleAuthenticationController);
authRouter.delete("/delete/:id", verifyToken, deleteUserController); // api/auth/delete/:id -> delete [id = userId - delete the user finally!]
authRouter.post("/verify-email", verifyToken, sendVerificationEmail); // TODO: only verified users can add property
authRouter.get("/verify-email/:id/:token", verifyToken, confirmEmail);
authRouter.post("/forgot-password", sendResetPasswordEmail);
authRouter.post("/reset-password/:id/:token", resetPassword);

export default authRouter;