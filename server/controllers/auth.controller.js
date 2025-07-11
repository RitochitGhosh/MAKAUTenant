import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { responseHandler } from "../utils/response.js";

export const signupController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) errorHandler(400, "All fields are required!"); // 1. Validate input
    

    const existingUser = await User.findOne({ email }); // 2. Check if user already exists
    if (existingUser) errorHandler(409, "User already exists with this email.")

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
    next(error)
  }
};

export const signinController = (req, res) => {};

export const signoutController = (req, res) => {};
