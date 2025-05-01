import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
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
            required: [true, 'Password is required'],
            minlength: 6,
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

export const UserModel = mongoose.model<IUser>('userModel', UserSchema);