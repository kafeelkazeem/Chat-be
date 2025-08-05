import mongoose, { Document, Schema, Types } from 'mongoose';


// Define the TypeScript interface for a User document.
export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  profilePicture?: string | null;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose Schema for a User.
const UserSchema: Schema = new Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null, // Can be null if the user has no picture.
    },
    // The timestamp of the user's last activity.
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Mongoose model for the User.
const User = mongoose.model<IUser>('User', UserSchema);
export default User;
