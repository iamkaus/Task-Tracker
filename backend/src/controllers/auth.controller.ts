import { Request, Response, NextFunction } from "express";
import User from '../models/user.model'

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
        const user = await User.findById(req.params.id);

        if ( !user ) {
            res.status(401).json({
                success: false,
                error: `User with id: ${req.params.id} not found.`
            })
        }
        res.status(200).json({
            success: true,
            data: user
        })
    } catch ( error: any ) {
        next(error);
    }
}