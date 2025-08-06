import express from 'express'
import { login, signup } from '../controllers/auth'
import { body } from 'express-validator'
import { isValid } from '../middlewares/checkValidation'


const router = express.Router()

const valUser = [
    body('username').trim().notEmpty().isString(),
    body('email').trim().notEmpty().isEmail().isString(),
    body('password').trim().notEmpty().isString()
]

const valLogin = [
    body('email').trim().notEmpty().isEmail().isString(),
    body('password').trim().notEmpty().isString()
]

router.post('/signup', valUser, isValid, signup)
router.post('/login', valLogin, isValid, login)

export default router