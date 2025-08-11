import { Request, Response } from "express";
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

export const sendMessage = async (req: Request, res: Response, io: SocketIOServer) =>{
    try {
        const { chatRoomId, senderId, content, type } = req.body as ISendMessageRequest

        if (!chatRoomId || !senderId || !content) {
            return res.status(400).json({ error: 'Missing required fields: chatRoomId, senderId, content.' });
        }

        const newMessage = new Message({chatRoomId, senderId, content, type});
        await newMessage.save()

        await ChatRoom.findByIdAndUpdate(chatRoomId, {
            $set: { lastMessage: newMessage._id },
        });

        io.to(chatRoomId).emit('newMessage', newMessage);

        res.status(201).json({ success: true, message: 'Message sent successfully.', data: newMessage });

    } catch (error) {
        console.log(error)
    }
}