import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../config/env.config";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
    matchPassword: (enteredPassword: string) => Promise<boolean>;
    getSignedJwtToken: () => string;
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 50,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
        },

        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false,
        },

        country: {
            type: String,
            required: [true, 'Please add your country'],
        },
    },
    {
        timestamps: true,
    }
)

UserSchema.pre<IUser>('save', async function (next): Promise<void> {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.methods.getSignedJwtToken = function (): string {
    return jwt.sign(
        {
            userId: this._id
        },
        JWT_SECRET as string,
        {
            expiresIn: '30d',
        }
    )
}

export default mongoose.model<IUser>('User', UserSchema);