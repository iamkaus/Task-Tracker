import { JWT_SECRET} from "../config/env.config";
import User, {IUser} from "../models/user.model";
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction} from "express";

/**
 * Interface representing the expected payload structure inside a decoded JWT token.
 *
 * @interface JwtPayload
 * @property {string} userId - The unique identifier of the authenticated user.
 */

interface JwtPayload {
    userId: string;
}

/**
 * Extended Express Request interface to include authenticated user information.
 *
 * This interface allows middleware to safely attach a user object to the request
 * after validating a token.
 *
 * @interface AuthenticatedRequest
 * @extends {Request}
 * @property {IUser} [user] - The authenticated user document from the database.
 */

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

/**
 * Middleware to authenticate users based on a Bearer token in the Authorization header.
 *
 * This middleware verifies the token, extracts the user ID, fetches the corresponding user
 * from the database, and attaches the user object to the request. If authentication fails,
 * it responds with a 401 Unauthorized status.
 *
 * @param {AuthenticatedRequest} req - The Express request object extended with `user`.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 * @returns {Promise<any>} Returns a Promise that resolves to the next middleware if authentication succeeds.
 */

export const userAuthenticationMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction):Promise<void> => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).send({
                success: false,
                message: 'Unauthorized',
            });
            return;
        }

        const token = authHeader.split('Bearer ')[1];
        const decodeToken = jwt.verify(token, JWT_SECRET);

        const user = await User.findById((decodeToken as JwtPayload).userId)

        if ( !user ) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized: No user found with that token.'
            });
        }

        req.user = user as IUser;
        next();

    } catch ( error: any ) {
        res.status(401).json({
            success: false,
            error: `Unauthorized: ${error.message}`,
        });
    }
}