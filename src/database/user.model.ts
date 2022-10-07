import * as mongoose from 'mongoose';
export const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  avatar: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verification token is required'],
  },
});

export interface User {
  email: string;
  password: string;
}
