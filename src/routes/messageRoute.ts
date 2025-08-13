import express from 'express'
import { body } from 'express-validator'
import { sendMessage } from '../controllers/message'

const router = express.Router();

const valSendMessage =[
    body('chatRoomId').notEmpty().isMongoId(),
    body('senderId').notEmpty().isMongoId(),
    body('content').notEmpty().isString(),
    body('type').isString()
]

router.post('/sendMessage', valSendMessage, sendMessage)

export default router