import { Router } from 'express';
import {
    createTask,
    deleteTaskById,
    getTasks,
    getTaskById,
    updateTaskById
} from "../controllers/task.controller";
import {userAuthenticationMiddleware} from "../middleware/auth.middleware";

/**
 * @constant taskRoute
 * @description Express router for handling task-related routes.
 */
const taskRoute = Router();

/**
 * @route POST /create-task
 * @description Creates a new task.
 * @access Private
 */
taskRoute.post('/create-task', userAuthenticationMiddleware, createTask);

/**
 * @route GET /api/v1/tasks/get-tasks
 * @description Retrieves all tasks for the authenticated user.
 * @access Private
 */
taskRoute.get('/get-tasks', userAuthenticationMiddleware, getTasks);

/**
 * @route GET /api/v1/tasks/get-task/:id
 * @description Retrieves a specific task by its ID.
 * @param {string} id - Task ID.
 * @access Private
 */
taskRoute.get('/get-task/:id', userAuthenticationMiddleware, getTaskById);

/**
 * @route PUT /api/v1/tasks/update-tasks/:id
 * @description Updates a specific task by its ID.
 * @param {string} id - Task ID.
 * @access Private
 */
taskRoute.put('/update-tasks/:id', userAuthenticationMiddleware, updateTaskById);

/**
 * @route DELETE /api/v1/tasks/delete-tasks/:id
 * @description Deletes a specific task by its ID.
 * @param {string} id - Task ID.
 * @access Private
 */
taskRoute.delete('/delete-tasks/:id', userAuthenticationMiddleware, deleteTaskById);

/**
 * @exports taskRoute
 * @description Exports the configured task router.
 */
export default taskRoute;
