import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express"
import config from '../config';

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.send(500).json({
                    success: false,
                    message: "you are not allowed for this time",

                })
            }

            const decode = jwt.verify(token, config.jwtSecret as string) as JwtPayload
            console.log(decode)
            req.user = decode ;

            if(roles.length && !roles.includes(decode.role as string)){
                return res.status(500).json({
                    success: false,
                    message : "unathorized"
                })
            }

            next()
        } catch (err: any) {
            res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}
export default auth;