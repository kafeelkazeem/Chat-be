import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './user';

// Define the TypeScript interface for a ChatRoom document.
export interface IChatRoom extends Document {
  type: 'private' | 'group';
  name?: string | null;
  participants: Types.ObjectId[] | IUser[]; // Can be an array of ObjectIds or populated User documents.
  lastMessage?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose Schema for a ChatRoom.
const ChatRoomSchema: Schema = new Schema(
  {
    // The type of chat room, either 'private' or 'group'.
    type: {
      type: String,
      enum: ['private', 'group'],
      required: true,
    },
    // The name of the group chat. Required for group chats, but not for private ones.
    name: {
      type: String,
      trim: true,
      default: null,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Mongoose model for the ChatRoom.
const ChatRoom = mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);
export default ChatRoom;