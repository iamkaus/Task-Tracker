import { JWT_SECRET} from "../config/env.config";
import User, {IUser} from "../models/user.model";
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction} from "express";

interface JwtPayload {
    userId: string;
}

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

export const userAuthenticationMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction):Promise<any> => {
    try {
        let token: string;
        if (req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(' ')[1];
        } else {
            return res.status(401).json({
                success: false,
                error: "Not authorized",
            })
        }

        const decodeToken = jwt.verify(token, JWT_SECRET);

        const user = await User.findById((decodeToken as JwtPayload).userId)

        if ( !user ) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized: No user found with that token.'
            });
        }

        req.user = user;
        next();

    } catch ( error: any ) {
        res.status(401).json({
            success: false,
            error: `Unauthorized: ${error.message}`,
        });
    }
}