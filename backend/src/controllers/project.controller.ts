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

/**
 * @function getProjects
 * @description
 * Controller function to fetch all projects associated with an authenticated user.
 * It checks for a valid authenticated user in the request, retrieves projects from the database
 * where the `user` field matches the authenticated user's `_id`, and returns them in the response.
 *
 * @param {AuthenticatedRequest} req - Express request object extended with optional authenticated user information.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends a JSON response containing the user's projects if found.
 * Returns appropriate error messages if the user is unauthenticated or has no projects.
 * If an unexpected error occurs, it passes the error to the next middleware.
 */

export const getProjects = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user._id) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }
        const userId = req.user?._id;

        if ( !userId ) {
            res.status(400).json({
                success: false,
                error: 'User ID not found.'
            })
        }

        const userProject = await ProjectModel.find({
            user: userId
        })

        if ( userProject.length === 0 ) {
            res.status(404).json({
                success: false,
                error: "User does not have any projects."
            })
        }

        res.status(200).json({
            success: true,
            message: 'User project found successfully.',
            data: userProject
        })

    } catch ( error: any ) {
        next(error);
    }
};

/**
 * @function getProjectById
 * @description
 * Controller function to fetch a single project by its unique identifier (`projectId`).
 * It expects a valid `projectId` parameter in the request URL, retrieves the corresponding project
 * from the database, and returns its details in the response.
 *
 * @param {Request} req - Express request object containing the `projectId` as a route parameter.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends a JSON response containing the project's details if found.
 * Returns appropriate error messages if the `projectId` is missing or the project is not found.
 * If an unexpected error occurs, it passes the error to the next middleware.
 */

export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId } = req.params;
        if ( !projectId ) {
            res.status(400).json({
                success: false,
                error: 'Project ID not found.'
            })
        }

        const projectDetails = await ProjectModel.findById(projectId);
        if ( !projectDetails ) {
            res.status(404).json({
                success: false,
                error: 'Project not found.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Project found successfully.',
            data: projectDetails
        })
    } catch ( error: any ) {
        next(error);
    }
};

/**
 * @function updateProjectById
 * @description
 * Controller function to update an existing project by its unique identifier (`projectId`).
 * It ensures the project exists, verifies that the authenticated user is the owner of the project,
 * and updates the project details with the provided request body data.
 *
 * @param {AuthenticatedRequest} req - Express request object extended with optional authenticated user information.
 * Contains the `projectId` as a route parameter and updated project data in the request body.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends a JSON response containing the updated project details if successful.
 * Returns appropriate error messages for missing project ID, unauthenticated access,
 * unauthorized operations, or if the project is not found.
 * Any unexpected errors are passed to the next middleware.
 */

export const updateProjectById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId } = req.params;
        if ( !projectId ) {
            res.status(400).json({
                success: false,
                error: 'Project ID not found.'
            });
            return;
        }

        const projectDetails = await ProjectModel.findById(projectId);
        if ( !projectDetails ) {
            res.status(404).json({
                success: false,
                error: 'Project not found.'
            });
            return;
        }

        const userId = req.user?._id;
        const projectUser = projectDetails?.user.toString()

        if ( !userId || userId.toString() !== projectUser ) {
            res.status(401).json({
                success: false,
                error: `Current user with ID: ${userId} is not authorised to update the project.`
            })
        }

        const updatedProject = await ProjectModel.findByIdAndUpdate(
            projectId,
            {
                ...req.body,
            },
            { new: true }
        );
        if ( !updatedProject ) {
            res.status(401).json({
                success: false,
                error: 'Error updating project.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully.',
            data: updatedProject
        })

    } catch ( error: any ) {
        next(error);
    }
};

/**
 * @function deleteProjectById
 * @description
 * Controller function to delete an existing project by its unique identifier (`projectId`).
 * It ensures the project exists, verifies that the authenticated user is the owner of the project,
 * and deletes the project from the database.
 *
 * @param {AuthenticatedRequest} req - Express request object extended with optional authenticated user information.
 * Contains the `projectId` as a route parameter.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends a JSON response confirming successful deletion of the project.
 * Returns appropriate error messages for missing project ID, unauthenticated access,
 * unauthorized operations, or if the project is not found.
 * Any unexpected errors are passed to the next middleware.
 */

export const deleteProjectById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { projectId } = req.params;
        if ( !projectId ) {
            res.status(400).json({
                success: false,
                error: 'Project ID not found.'
            });
            return;
        }

        const projectDetails = await ProjectModel.findById(projectId);
        if ( !projectDetails ) {
            res.status(404).json({
                success: false,
                error: 'Project not found.'
            });
            return;
        }

        const userId = req.user?._id;
        const projectUser = projectDetails?.user.toString()

        if ( !userId || userId.toString() !== projectUser ) {
            res.status(401).json({
                success: false,
                error: `Current user with ID: ${userId} is not authorised to delete the project.`
            });
            return;
        }

        const deletedProject = await ProjectModel.findByIdAndDelete(projectId);
        if ( !deletedProject ) {
            res.status(401).json({
                success: false,
                error: 'Error deleting project.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully.',
            data: deletedProject
        })

    } catch ( error: any ) {
        next(error);
    }
};