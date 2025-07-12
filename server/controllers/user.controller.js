import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import { responseHandler } from "../utils/response.js";

export const updateUserController = async (req, res, next) => {
  console.log("UPDATE_USER controller: Got request: ", req.body);
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }

  try {
    let { username, email, password, avatar } = req.body;

    if (!username && !email && !password && !avatar) {
      return next(errorHandler(400, "All fields can't be empty!"));
    }

    const existingUser = await User.findById(req.params.id);
    if (!existingUser) return next(errorHandler(404, "User not found"));

    const isSameUsername = username === existingUser.username;
    const isSameEmail = email === existingUser.email;
    const isSameAvatar = avatar === existingUser.avatar;

    let isSamePassword = true;
    if (password) {
      isSamePassword = await bcrypt.compare(password, existingUser.password);
    }

    if (isSameUsername && isSameEmail && isSamePassword && isSameAvatar) {
      return next(errorHandler(400, "Nothing to change!"));
    }

    if (password && !isSamePassword) {
      password = await bcrypt.hash(password, 10);
    } else {
      password = existingUser.password; // keep old hashed password
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: username || existingUser.username,
          email: email || existingUser.email,
          password,
          avatar: avatar || existingUser.avatar,
        },
      },
      { new: true }
    );

    const { password: _, ...rest } = updatedUser._doc;

    return responseHandler(res, 200, rest, "Updated profile successfully!");
  } catch (error) {
    return next(error);
  }
};
