import mongoose, { Document, Schema, Types } from 'mongoose';
import { IUser } from './user';
import { IChatRoom } from './chatRoom';

// Define the TypeScript interface for a Message document.
export interface IMessage extends Document {
  chatRoomId: Types.ObjectId | IChatRoom;
  senderId: Types.ObjectId | IUser;
  content: string;
  type: 'text' | 'image' | 'file';
  readBy: Types.ObjectId[];
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Mongoose Schema for a Message.
const MessageSchema: Schema = new Schema(
  {
    chatRoomId: {
      type: Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    // Flag to indicate if the message has been soft-deleted.
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Mongoose model for the Message.
const Message = mongoose.model<IMessage>('Message', MessageSchema);
export default Message;