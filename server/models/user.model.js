import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    fullname: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    profilePicture:{
      type: String,
      
    },
    password: {
      type: String,
      required: true,
    },
    role:{type: String, required: true },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
UserSchema.methods.isPasswordCorrect = async function (Password) {
  return await bcrypt.compare(Password, this.password);
};
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", UserSchema);
