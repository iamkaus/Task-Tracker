import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    project: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    completedAt?: Date;
    updatedAt: Date;
}

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

export const TaskModel = mongoose.model<ITask>('TaskModel', TaskSchema);