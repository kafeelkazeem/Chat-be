import express from 'express'
import { body } from 'express-validator'
import { createChatRoom } from '../controllers/chatRoom'

const router = express.Router()

const valCreateChatRoom = [
    body('chatRoomId').notEmpty().isMongoId(),
    body('participant').notEmpty().isArray(),
    body('type').notEmpty().isString(),
    body('lastMessage').notEmpty().isString()
]

router.post('/createChatRoom', valCreateChatRoom, createChatRoom)

export default router