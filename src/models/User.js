import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const User = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
    facebookId: {
      type: String,
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// User.path('password').required(function () {
//   return this.mode === 'SERVER';
// }, 'Password required');

User.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

User.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

export default model('User', User);
