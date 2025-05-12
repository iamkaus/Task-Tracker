import { Request, Response, NextFunction } from 'express';
import {ParamsDictionary} from "express-serve-static-core";
import {ParsedQs} from "qs";
import {TaskModel} from "../models/task.model";

interface UserRequests {
    _id: string;
}

interface AuthenticatedRequest extends Request <ParamsDictionary, any, any, ParsedQs> {
    user?: UserRequests;
}

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { title, description, status, projectId } = req.body;
        if ( !title || !description || !status || !projectId ) {
            res.status(400).json({
                success: false,
                error: 'Missing required field.'
            });
            return;
        }

        if (!req.user || !req.user._id) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }

        const userId = req.user?._id

        const newTask = await TaskModel.create({
            title,
            description,
            status,
            projectId,
            user: userId,
        });

        if ( !newTask ) {
            res.status(400).json({
                success: false,
                error: 'Error creating task.'
            });
            return;
        }

        res.status(201).json({
            success: true,
            message: 'Task created successfully.',
            data: newTask
        })

    } catch ( error: any ) {
        next(error);
    }
}

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {}

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {}

export const updateTaskById = async (req: Request, res: Response, next: NextFunction) => {}

export const deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {}