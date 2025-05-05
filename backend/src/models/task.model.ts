import mongoose, { Schema, Document } from "mongoose";

/**
 * @interface ITask
 * @description Interface representing a Task document in MongoDB.
 * Extends the base Mongoose Document interface.
 */

export interface ITask extends Document {
    /** Title of the task */
    title: string;
    /** Description providing details about the task */
    description: string;
    /** Current status of the task: 'todo', 'in-progress', or 'completed' */
    status: 'todo' | 'in-progress' | 'completed';
    /** Reference to the associated Project */
    project: mongoose.Types.ObjectId;
    /** Reference to the User who created or is assigned to the task */
    user: mongoose.Types.ObjectId;
    /** Timestamp when the task was created (auto-generated) */
    createdAt: Date;
    /** Optional timestamp when the task was completed */
    completedAt?: Date;
    /** Timestamp when the task was last updated (auto-generated) */
    updatedAt: Date;
}

/**
 * @constant TaskSchema
 * @description Mongoose schema defining the structure and validation rules for a Task document.
 * Includes fields for title, description, status, project reference, user reference, and timestamps.
 */

const TaskSchema = new Schema<ITask>(
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

        status: {
            type: String,
            enum: ['todo', 'in-progress', 'completed'],
            default: 'todo',
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProjectModel',
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

/**
 * @constant TaskModel
 * @description Mongoose model for interacting with the 'tasks' collection in MongoDB.
 * Based on the TaskSchema and ITask interface.
 */

export const TaskModel = mongoose.model<ITask>('TaskModel', TaskSchema);