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

export const logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}

export const logOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}