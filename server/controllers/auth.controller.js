import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { responseHandler } from "../utils/response.js";
import jwt from "jsonwebtoken";

export const signupController = async (req, res, next) => {
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
    responseHandler(res, 200, rest, `Signed in successfully!`);
  } catch (err) {
    next(err);
  }
};

export const googleAuthenticationController = async (req, res, next) => {
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
export const signoutController = (req, res) => {};
