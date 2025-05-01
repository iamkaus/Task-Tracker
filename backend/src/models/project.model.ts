import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    title: string;
    description: string;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

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
            ref: 'UserModel',
            required: true,
        },
    },
    {
        timestamps: true,

    }
);
export const ProjectModel = mongoose.model<IProject>('ProjectModel', ProjectSchema);