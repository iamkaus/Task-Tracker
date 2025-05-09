import mongoose, { Schema, Document } from 'mongoose';

/**
 * @interface IProject
 * @description Interface representing a Project document in MongoDB.
 * Extends the base Mongoose Document interface.
 */

export interface IProject extends Document {
    /** Title of the project */
    title: string;

    /** Description providing details about the project */
    description: string;

    /** Reference to the user who owns the project */
    user: mongoose.Types.ObjectId;

    /** Timestamp of project creation (auto-generated) */
    createdAt: Date;

    /** Timestamp of the last update (auto-generated) */
    updatedAt: Date;
}

/**
 * @constant ProjectSchema
 * @description Mongoose schema defining the structure of a Project document.
 * Includes fields for title, description, user reference, and timestamps.
 */

const ProjectSchema = new Schema<IProject>(
    {
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
        },

        description: {
            type: String,
            required: [true, 'Please add a description'],
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,

    }
);

/**
 * @constant ProjectModel
 * @description Mongoose model for interacting with the 'projects' collection in MongoDB.
 * Based on the ProjectSchema and IProject interface.
 */

export const ProjectModel = mongoose.model<IProject>('ProjectModel', ProjectSchema);