import { Request, Response, NextFunction } from 'express';
import {ParamsDictionary} from "express-serve-static-core";
import {ParsedQs} from "qs";
import {TaskModel} from "../models/task.model";

/**
 * @interface UserRequests
 * @description
 * Represents the authenticated user's minimal data structure
 * containing the unique identifier (`_id`) used for task association.
 */

interface UserRequests {
    _id: string;
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
 * @function createTask
 * @description
 * Controller function to handle the creation of a new task.
 * It requires the request to contain an authenticated user.
 * Creates a new task in the database associated with the user's `_id`.
 *
 * @param {AuthenticatedRequest} req - Express request object extended with optional user data.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends an appropriate JSON response depending on the operation's result.
 * If an error occurs, it passes the error to the next middleware.
 */

export const createTask = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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

/**
 * @function getTasks
 * @description
 * Controller function to fetch all tasks associated with an authenticated user.
 * It checks for a valid authenticated user in the request, retrieves tasks from the database
 * where the `user` field matches the authenticated user's `_id`, and returns them in the response.
 *
 * @param {AuthenticatedRequest} req - Express request object extended with optional authenticated user information.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends a JSON response containing the user's tasks if found.
 * Returns appropriate error messages if the user is unauthenticated or has no tasks.
 * If an unexpected error occurs, it passes the error to the next middleware.
 */

export const getTasks = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
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
            res.status(404).json({
                success: false,
                error: `No tasks found for user: ${userId}.`
            })
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Tasks found successfully.',
            data: userTasks
        })

    }  catch ( error: any ) {
        next(error);
    }
}

/**
 * @function getTaskById
 * @description
 * Controller function to fetch a single task by its unique identifier (`taskId`).
 * It expects a valid `taskId` parameter in the request URL, retrieves the corresponding task
 * from the database, and returns its details in the response.
 *
 * @param {Request} req - Express request object containing the `taskId` as a route parameter.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends a JSON response containing the task's details if found.
 * Returns appropriate error messages if the `taskId` is missing or the task is not found.
 * If an unexpected error occurs, it passes the error to the next middleware.
 */

export const getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { taskId } = req.params;
        if ( !taskId ) {
            res.status(400).json({
                success: false,
                error: 'Task ID not found.'
            })
            return;
        }

        const taskDetails = await TaskModel.findById(taskId);
        if ( !taskDetails ) {
            res.status(404).json({
                success: false,
                error: 'Task not found.'
            })
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Task found successfully.',
            data: taskDetails
        })

    } catch ( error: any ) {
        next(error);
    }
}

/**
 * @function updateTaskById
 * @description
 * Controller function to update an existing task by its unique identifier (`taskId`).
 * It ensures the task exists, verifies that the authenticated user is the owner of the task,
 * and updates the task details with the provided request body data.
 *
 * @param {AuthenticatedRequest} req - Express request object extended with optional authenticated user information.
 * Contains the `taskId` as a route parameter and updated task data in the request body.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends a JSON response containing the updated task details if successful.
 * Returns appropriate error messages for missing task ID, unauthenticated access,
 * unauthorized operations, or if the task is not found.
 * Any unexpected errors are passed to the next middleware.
 */

export const updateTaskById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        if (!req.user || !req.user._id) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }

        const { taskId } = req.params;
        if ( !taskId ) {
            res.status(400).json({
                success: false,
                error: 'task ID not found.'
            });
            return;
        }

        const taskDetails = await TaskModel.findById(taskId);
        if ( !taskDetails ) {
            res.status(404).json({
                success: false,
                error: 'Task not found.'
            });
            return;
        }

        const userId = req.user?._id;
        const taskUser = taskDetails?.user.toString()

        if ( !userId || userId.toString() !== taskUser ) {
            res.status(401).json({
                success: false,
                error: `Current user with ID: ${userId} is not authorised to update the task.`
            })
            return;
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(
            taskId,
            {
                ...req.body,
            },
            { new: true }
        );
        if ( !updatedTask ) {
            res.status(401).json({
                success: false,
                error: 'Error updating task.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully.',
            data: updatedTask
        })

    } catch ( error: any ) {
        next(error);
    }
}

/**
 * @function deleteTaskById
 * @description
 * Controller function to delete an existing task by its unique identifier (`taskId`).
 * It ensures the task exists, verifies that the authenticated user is the owner of the task,
 * and deletes the task from the database.
 *
 * @param {AuthenticatedRequest} req - Express request object extended with optional authenticated user information.
 * Contains the `taskId` as a route parameter.
 * @param {Response} res - Express response object for sending JSON responses.
 * @param {NextFunction} next - Express middleware function for error handling.
 *
 * @returns {Promise<void>}
 * Sends a JSON response confirming successful deletion of the task.
 * Returns appropriate error messages for missing task ID, unauthenticated access,
 * unauthorized operations, or if the task is not found.
 * Any unexpected errors are passed to the next middleware.
 */

export const deleteTaskById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.user || !req.user._id) {
            res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
            return;
        }

        const { taskId } = req.params;
        if ( !taskId ) {
            res.status(400).json({
                success: false,
                error: 'Task ID not found.'
            });
            return;
        }

        const taskDetails = await TaskModel.findById(taskId);
        if ( !taskDetails ) {
            res.status(404).json({
                success: false,
                error: 'Task not found.'
            });
            return;
        }

        const userId = req.user?._id;
        const taskUser = taskDetails?.user.toString()

        if ( !userId || userId.toString() !== taskUser ) {
            res.status(401).json({
                success: false,
                error: `Current user with ID: ${userId} is not authorised to delete the task.`
            });
            return;
        }

        const deletedTask = await TaskModel.findByIdAndDelete(taskId);
        if ( !deletedTask ) {
            res.status(401).json({
                success: false,
                error: 'Error deleting task.'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully.',
            data: deletedTask
        })

    } catch ( error: any ) {
        next(error);
    }
}