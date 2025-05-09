import { Request, Response, NextFunction } from "express";
import User from '../models/user.model'
import jwt from "jsonwebtoken";

interface MyJwtPayload extends jwt.JwtPayload {
    userId: string;
}

/**
 * @function signUp
 * @description Registers a new user by saving their details into the database and returning a signed JWT token.
 * @param {Request} req - Express request object containing user registration data in the body.
 * @param {Response} res - Express response object used to send status and JSON data.
 * @param {NextFunction} next - Express next middleware function for error handling.
 * @returns {Promise<void>} Responds with success status, JWT token, and newly created user data on success.
 *
 * @throws {400} If any required fields are missing or if a user with the provided email already exists.
 */

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name, email, password, country } = req.body;

        if (!name || !email || !password || !country) {
            res.status(400).json({
                success: false,
                error: 'Name or email or password or country is missing'
            })
        }

        const existingUser = await User.findOne({email: email});
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User already exists'
            })
        }

        const newUser = await User.create({
            name,
            email,
            password,
            country
        })

        const token = newUser.getSignedJwtToken();

        res.status(201).json(
            {
                success: true,
                token,
                data: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    country: newUser.country,
                },
            }
        );

    } catch ( error: any ) {
        next(error);
    }
}

/**
 * @function logIn
 * @description Authenticates an existing user by verifying their credentials and returning a JWT token.
 * @param {Request} req - Express request object containing login credentials in the body.
 * @param {Response} res - Express response object used to send status and JSON data.
 * @param {NextFunction} next - Express next middleware function for error handling.
 * @returns {Promise<void>} Responds with success status, JWT token, and user data on success.
 *
 * @throws {400} If email or password is missing.
 * @throws {401} If user is not found or password doesn't match.
 */

export const logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Please enter a valid email address and password.'
            })
        }

        const user = await User.findOne({email: email}).select('+password');
        if ( !user ) {
            res.status(401).json({
                success: false,
                error: 'User does not exist or invalid credentials.'
            });
            return;
        }

        const isMatch = await user.matchPassword(password);
        if ( !isMatch ) {
            res.status(401).json({
                success: false,
                error: 'Invalid credentials.'
            });
            return;
        }

        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                country: user.country
            },
        });

    } catch ( error: any ) {
        next(error);
    }
}

/**
 * An extended Express Request interface to include authenticated user data.
 *
 * This interface adds an optional `user` property to the standard Express `Request`,
 * which can be populated by authentication middleware after verifying a token.
 *
 * @interface AuthenticatedRequest
 * @extends {Request}
 *
 * @property {Object} [user] - Optional authenticated user object.
 * @property {string} user._id - Unique identifier of the authenticated user.
 */

interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
}

/**
 * @function getMe
 * @description Retrieves the authenticated user's details using the JWT token provided in the Authorization header.
 * @param {Request} req - Express request object containing the authorization token in headers.
 * @param {Response} res - Express response object used to send status and JSON data.
 * @param {NextFunction} next - Express next middleware function for error handling.
 * @returns {Promise<void>} Responds with success status and user data on success.
 *
 * @throws {401} If no token is provided, token is invalid, or user not found.
 */

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if ( !req.user || !req.user._id) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized: User not authenticated'
            });
            return;
        }

        const userData = await User.findById(req.user._id);

        if ( !userData ) {
            res.status(401).json({
                success: false,
                error: `User with id: ${req.user._id} not found.`,
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: userData
        });

    } catch ( error: any ) {
        next(error);
    }
}