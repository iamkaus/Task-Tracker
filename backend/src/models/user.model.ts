import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../config/env.config";
import jwt from "jsonwebtoken";

/**
 * @interface IUser
 * @description Interface representing a User document in MongoDB.
 * Extends the base Mongoose Document interface.
 */

export interface IUser extends Document {
    /** Full name of the user */
    name: string;
    /** Email address of the user (unique, lowercase, validated format) */
    email: string;
    /** Hashed password of the user */
    password: string;
    /** User's country */
    country: string;
    /** Timestamp of user creation (auto-generated) */
    createdAt: Date;
    /** Timestamp of the last update (auto-generated) */
    updatedAt: Date;

    /**
     * @method matchPassword
     * @description Compares a provided password string with the hashed password stored in the database.
     * @param {string} enteredPassword - The plain-text password to compare.
     * @returns {Promise<boolean>} - Resolves to true if the passwords match, false otherwise.
     */
    matchPassword: (enteredPassword: string) => Promise<boolean>;

    /**
     * @method getSignedJwtToken
     * @description Generates a signed JWT token containing the user's MongoDB ID.
     * @returns {string} - The signed JWT token valid for 30 days.
     */
    getSignedJwtToken: () => string;
}

/**
 * @constant UserSchema
 * @description Mongoose schema defining the structure and validation rules for a User document.
 * Includes fields for name, email, password, and country. Automatically tracks timestamps.
 */

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

/**
 * @pre save
 * @description Mongoose middleware to hash the user's password before saving it to the database.
 * Runs only if the password field is modified.
 */

UserSchema.pre<IUser>('save', async function (next): Promise<void> {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

/**
 * @method matchPassword
 * @description Compares an entered plain-text password with the hashed password in the database.
 * @param {string} enteredPassword - The password entered by the user.
 * @returns {Promise<boolean>} - True if the passwords match; false otherwise.
 */

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
}

/**
 * @method getSignedJwtToken
 * @description Generates a signed JWT token for the authenticated user.
 * @returns {string} - Signed JWT token valid for 30 days.
 */

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

/**
 * @constant User
 * @description Mongoose model for interacting with the 'users' collection in MongoDB.
 * Based on the UserSchema and IUser interface.
 */

export default mongoose.model<IUser>('User', UserSchema);