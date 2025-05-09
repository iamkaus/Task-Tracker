import { Request, Response, NextFunction } from 'express';
import {ProjectModel} from "../models/project.model";
import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';

interface UserRequests {
    _id: string
}

interface AuthenticatedRequest extends Request <ParamsDictionary, any, any, ParsedQs> {
    user?: UserRequests;
}

export const createProject = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Type check and cast to ensure the user object exists
        if (!req.user || !req.user._id) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }

        const userId = req.user._id;

        const newProject = await ProjectModel.create({
            ...req.body,
            user: userId,
        });

        if (!newProject) {
            res.status(500).json({
                success: false,
                error: 'Error creating Project'
            });
            return; // Add return to prevent further execution
        }

        res.status(201).json({
            success: true,
            message: 'Project created',
            data: newProject
        });
    } catch (error: any) {
        next(error);
    }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}

export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}

export const updateProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}

export const deleteProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}