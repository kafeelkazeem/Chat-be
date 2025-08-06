import { validationResult } from "express-validator"
import { Request, Response, NextFunction } from "express"

export const isValid = (req: Request, res: Response, next: NextFunction) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        console.log(error.array())
        return res.status(401).json({error: error.array()})
    }
    next()
}