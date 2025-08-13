import express from 'express'
import { body, param } from 'express-validator'
import { getMessage, sendMessage } from '../controllers/message'

const router = express.Router();

const valSendMessage =[
    body('chatRoomId').notEmpty().isMongoId(),
    body('senderId').notEmpty().isMongoId(),
    body('content').notEmpty().isString(),
    body('type').isString()
]

const valGetMessage = [
    param('chatRoomId').notEmpty().isMongoId()
]

router.post('/sendMessage', valSendMessage, sendMessage)
router.get('/getMessages', valGetMessage, getMessage)

export default router