import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { responseHandler } from "../utils/response.js";
import jwt from "jsonwebtoken";
import { resend } from "../utils/resend.js";
import crypto from "crypto";

export const signupController = async (req, res, next) => {
  console.log("SIGN-UP contoller: Got request: ", req.body);
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      errorHandler(400, "All fields are required!"); // 1. Validate input

    const existingUser = await User.findOne({ email }); // 2. Check if user already exists
    if (existingUser) errorHandler(409, "User already exists with this email.");

    const hashedPassword = await bcrypt.hash(password, 10); // 3. Hash the password

    // 4. Create the user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const data = await newUser.save();

    // 5. Respond
    responseHandler(res, 201, data, "User created successfully!");
  } catch (error) {
    next(error);
  }
};

export const signinController = async (req, res, next) => {
  console.log("SIGN-IN contoller: Got request: ", req.body);
  try {
    const { email, password } = req.body;

    if (!email || !password) errorHandler(400, "All fields are required!");

    const existingUser = await User.findOne({ email });

    if (!existingUser) errorHandler(404, `No user exists with ${email}`);

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) errorHandler(400, "Password do not match");

    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: pass, ...rest } = existingUser._doc;

    console.log("SIGN-IN controller: Response: ", rest);
    console.log("SIGN-IN controller: access_token: ", token);

    responseHandler(res, 200, rest, `Signed in successfully!`);
  } catch (err) {
    next(err);
  }
};

export const googleAuthenticationController = async (req, res, next) => {
  console.log("GOOGLE-AUTH contoller: Got request: ", req.body);
  try {
    const { name, email, photo } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { password: pass, ...rest } = user._doc;
      responseHandler(res, 200, rest, "Signed in successfully!");
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);

      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
      });
      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      });

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const { password: pass, ...rest } = newUser._doc;
      responseHandler(res, 200, rest, "User created successfully!");
    }
  } catch (error) {
    next(error);
  }
};

export const signoutController = (req, res) => {
  console.log("SIGN_OUT controller: Got request...");
  res.clearCookie("access_token", {
    sameSite: "Strict",
    secure: process.env.NODE_ENV === "production",
  });
  return responseHandler(res, 200, null, "Signed out successfully!");
};

export const deleteUserController = async (req, res, next) => {
  console.log("DELETE_USER controller: Got request: ", req.params.id);
  try {
    const userId = req.params.id;
    if (req.user.id !== userId)
      return next(errorHandler(403, "You can only delete your own account!"));

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) return next(errorHandler(404, "User not found!"));

    res.clearCookie("access_token");
    return responseHandler(res, 200, null, "Account deleted successfully!");
  } catch (err) {
    next(err);
  }
};

export const sendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found!"));

    if (user.isVerified)
      return next(errorHandler(400, "User already verified!"));

    const token = crypto.randomBytes(32).toString("hex");
    user.verificationToken = token;
    user.verificationTokenExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${user._id}/${token}`;
    // console.log("VERIFY_EMAIL controller: Verifiction link: ", verifyUrl);
    console.log("VERIFY_EMAIL controller: token: ", token);
    console.log("VERIFY_EMAIL controller: id: ", user._id);
    console.log(
      `VERIFY_EMAIL controller: Send get requet to http://localhost:3000/api/auth/verify-email/${user._id}/${token}`
    );

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: user.email,
      subject: "Verify your email",
      html: `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    const resData = {
      verifyUrl: token,
    };

    responseHandler(
      res,
      200,
      resData,
      "Verification email sent to your registered email address."
    );
  } catch (error) {
    next(error);
  }
};

export const confirmEmail = async (req, res, next) => {
  const { id, token } = req.params;
  console.log("VERIFY_EMAIL controller: endpoint reached!");

  try {
    const user = await User.findById(id);

    if (
      !user ||
      user.verificationToken != token ||
      Date.now() > user.verificationTokenExpires
    ) {
      return next(errorHandler(400, "Invalid or expired token"));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    const { password: pass, ...rest } = user._doc;
    responseHandler(res, 200, rest, "Email verified successfully!");
  } catch (error) {
    next(error);
  }
};

export const sendResetPasswordEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return next(errorHandler(404, "User not found!"));

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Reset your password",
      html: `<p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    responseHandler(res, 200, {}, "Password reset email sent.");
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (
      !user ||
      user.resetToken !== token ||
      Date.now() > user.resetTokenExpires
    ) {
      return next(errorHandler(400, "Invalid or expired token"));
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    responseHandler(res, 200, null, "Password updated successfully!");
  } catch (err) {
    next(err);
  }
};
