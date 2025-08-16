import { NextFunction, Request, Response } from "express";
import ChatRoom from '../models/chatRoom'

interface ICreateChatRoom{
    chatRoomId: String,
    type: String,
    participant: String[],
    lastMessage: String,
}

export const createChatRoom = async (req: Request, res: Response) =>{
    try {
        const {chatRoomId, type, participant, lastMessage} = req.body as ICreateChatRoom

        const newChatRoom = new ChatRoom({chatRoomId, type, participant, lastMessage})
        await newChatRoom.save()
        
        res.status(201).json({message: 'chat room created', success: true, data: newChatRoom})

    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}