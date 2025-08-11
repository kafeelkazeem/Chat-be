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
        
    } catch (error) {
        console.log(error)
    }
}