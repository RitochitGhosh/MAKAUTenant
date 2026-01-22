import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      default: "Kolkata",
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://imgs.search.brave.com/De4tHZXFf0rkzZbSuaR7yhXmnVNy0IA1NZLTAn1VZq0/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMjYv/NDE4LzgwOC9zbWFs/bC9tYW4taGVhZC11/c2VyLXByb2ZpbGUt/Y2hhcmFjdGVyLWZy/ZWUtcG5nLnBuZw"
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationTokenExpires: Date,

    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
