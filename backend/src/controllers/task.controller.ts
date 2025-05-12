import { Request, Response, NextFunction } from 'express';
import {ParamsDictionary} from "express-serve-static-core";
import {ParsedQs} from "qs";
import {TaskModel} from "../models/task.model";
import {ProjectModel} from "../models/project.model";

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
            project: projectId,
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

export const getTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user || !req.user._id) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }
        const userId = req.user._id;

        const userTasks = await TaskModel.find({
            user: userId
        })

        if ( !userTasks ) {
            res.status(400).json({
                success: false,
                error: `No tasks found for user: ${userId}.`
            })
            return;
        }

        res.status(200).json({
            success: true,
            error: 'Tasks found successfully.',
            data: userTasks
        })
    }  catch ( error: any ) {
        next(error);
    }
}

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;
        if ( !taskId ) {
            res.status(401).json({
                success: false,
                error: 'Task ID not found.'
            })
        }

        const taskDetails = await TaskModel.findById(taskId);
        if ( !taskDetails ) {
            res.status(401).json({
                success: false,
                error: 'Task not found.'
            })
        }

        res.status(201).json({
            success: true,
            message: 'Task found successfully.',
            data: taskDetails
        })
    } catch ( error: any ) {
        next(error);
    }
}

export const updateTaskById = async (req: Request, res: Response, next: NextFunction) => {

}

export const deleteTaskById = async (req: Request, res: Response, next: NextFunction) => {}