import { Request, Response, NextFunction } from 'express';
import {ProjectModel} from "../models/project.model";
import { ParsedQs } from 'qs';
import { ParamsDictionary } from 'express-serve-static-core';

/**
 * @interface UserRequests
 * @description
 * Represents the authenticated user's minimal data structure
 * containing the unique identifier (`_id`) used for project association.
 */

interface UserRequests {
    _id: string
}

/**
 * @interface AuthenticatedRequest
 * @extends Request
 * @description
 * Extends the Express `Request` interface to optionally include
 * a `user` property representing the authenticated user making the request.
 *
 * @template ParamsDictionary - Route parameters type (from Express).
 * @template any - Response body type.
 * @template any - Request body type.
 * @template ParsedQs - Query parameters type (from qs).
 */

interface AuthenticatedRequest extends Request <ParamsDictionary, any, any, ParsedQs> {
    user?: UserRequests;
}

/**
 * @function createProject
 * @description
 * Controller function to handle the creation of a new project.
 * It requires the request to contain an authenticated user.
 * Creates a new project in the database associated with the user's `_id`.
 *
 * @param {AuthenticatedRequest} req - Express request object extended with optional user data.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends an appropriate JSON response depending on the operation's result.
 * If an error occurs, it passes the error to the next middleware.
 */

export const createProject = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

export const getProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?._id;

        if ( !userId ) {
            res.status(401).json({
                success: false,
                error: 'User ID not found.'
            })
        }

        const userProject = await ProjectModel.find({
            user: userId
        })

        if ( userProject.length === 0 ) {
            res.status(401).json({
                success: false,
                error: "User does not have any projects."
            })
        }

        res.status(201).json({
            success: true,
            message: 'User project found successfully.',
            data: userProject
        })

    } catch ( error: any ) {
        next(error);
    }
}

export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}

export const updateProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}

export const deleteProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {}