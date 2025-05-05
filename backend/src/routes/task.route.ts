import { Router } from 'express';
import {
    createTask,
    deleteTaskById,
    getTasks,
    getTaskById,
    updateTaskById
} from "../controllers/task.controller";

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
taskRoute.post('/create-task', createTask);

/**
 * @route GET /api/v1/tasks/get-tasks
 * @description Retrieves all tasks for the authenticated user.
 * @access Private
 */
taskRoute.get('/get-tasks', getTasks);

/**
 * @route GET /api/v1/tasks/get-task/:id
 * @description Retrieves a specific task by its ID.
 * @param {string} id - Task ID.
 * @access Private
 */
taskRoute.get('/get-task/:id', getTaskById);

/**
 * @route PUT /api/v1/tasks/update-tasks/:id
 * @description Updates a specific task by its ID.
 * @param {string} id - Task ID.
 * @access Private
 */
taskRoute.put('/update-tasks/:id', updateTaskById);

/**
 * @route DELETE /api/v1/tasks/delete-tasks/:id
 * @description Deletes a specific task by its ID.
 * @param {string} id - Task ID.
 * @access Private
 */
taskRoute.delete('/delete-tasks/:id', deleteTaskById);

/**
 * @exports taskRoute
 * @description Exports the configured task router.
 */
export default taskRoute;
