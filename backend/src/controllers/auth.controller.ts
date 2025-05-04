import { Request, Response, NextFunction } from "express";
import User from '../models/user.model'
import {JWT_SECRET} from "../config/env.config";
import jwt from "jsonwebtoken";

interface MyJwtPayload extends jwt.JwtPayload {
    userId: string;
}

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

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let token: string;
        let decodedToken;
        if (req.headers.authorization?.startsWith('Bearer ')) {

            token = req.headers.authorization.split(' ')[1];
            decodedToken = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
        } else {
            res.status(401).json({
                success: false,
                error: 'Unauthorized: No token provided'
            });
        }

        const user = await User.findById(decodedToken?.userId);
        if ( !user ) {
            res.status(401).json({
                success: false,
                error: 'Unauthorized: No user found with that token.'
            })
        }
        res.status(200).json({
            success: true,
            message: 'User found.',
            data: user
        })
    } catch ( error: any ) {
        next(error);
    }
}