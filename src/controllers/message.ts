import { NextFunction, Request, Response } from "express";
import { Server as SocketIOServer } from 'socket.io';
import ChatRoom from '../models/chatRoom'
import Message from "../models/messages";

// Interface for the request body when sending a message
interface ISendMessageRequest {
    chatRoomId: string;
    senderId: string;
    content: string;
    type?: string;
}

// A higher-order function that takes the Socket.IO instance
// and returns the actual Express request handler.
export const sendMessage = (io: SocketIOServer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Destructure the required fields from the request body
            const { chatRoomId, senderId, content, type } = req.body as ISendMessageRequest;

            // Basic validation
            if (!chatRoomId || !senderId || !content) {
                return res.status(400).json({ error: 'Missing required fields: chatRoomId, senderId, content.' });
            }

            // Create a new message in the database
            const newMessage = new Message({ chatRoomId, senderId, content, type });
            await newMessage.save();

            // Update the chat room's last message
            await ChatRoom.findByIdAndUpdate(chatRoomId, {
                $set: { lastMessage: newMessage._id },
            });

            // Emit the new message to the correct chat room via Socket.IO
            io.to(chatRoomId).emit('newMessage', newMessage);

            // Send a success response back to the client
            res.status(201).json({ success: true, message: 'Message sent successfully.', data: newMessage });

        } catch (error) {
            console.log(error);
            // Handle internal server errors
            res.status(500).json({ success: false, message: 'An internal server error occurred.' });
        }
    };
};

export const getMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {chatRoomId} = req.params
        const chatRoom = await ChatRoom.findById(chatRoomId);
        if (!chatRoom) {
            return res.status(404).json({ error: 'Chat room not found.' });
        }
        const messages = await Message.find({ chatRoomId }).sort({ createdAt: 1 }).populate('senderId', 'username displayName profilePicture');
        res.status(200).json({data: messages})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
}