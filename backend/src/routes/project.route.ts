import { Router } from 'express';
import {
    createProject,
    deleteProjectById,
    getProjectById,
    getProjects,
    updateProjectById
} from "../controllers/project.controller";
import {userAuthenticationMiddleware} from "../middleware/auth.middleware";

/**
 * @constant projectRoute
 * @description Express router for handling project-related routes.
 */
const projectRoute = Router();

/**
 * @route POST /api/v1/projects/create-project
 * @description Creates a new project.
 * @access Private
 */
projectRoute.post('/create-project', userAuthenticationMiddleware, createProject);

/**
 * @route GET /api/v1/projects/get-projects
 * @description Retrieves all projects for the authenticated user.
 * @access Private
 */
projectRoute.get('/get-projects', getProjects);

/**
 * @route GET /api/v1/projects/get-project/:id
 * @description Retrieves a specific project by its ID.
 * @param {string} id - Project ID.
 * @access Private
 */
projectRoute.get('/get-project/:id', getProjectById);

/**
 * @route PUT /api/v1/projects/update-project/:id
 * @description Updates a specific project by its ID.
 * @param {string} id - Project ID.
 * @access Private
 */
projectRoute.put('/update-project/:id', updateProjectById);

/**
 * @route DELETE /api/v1/projects/delete-project/:id
 * @description Deletes a specific project by its ID.
 * @param {string} id - Project ID.
 * @access Private
 */
projectRoute.delete('/delete-project/:id', deleteProjectById);

/**
 * @exports projectRoute
 * @description Exports the configured project router.
 */
export default projectRoute;
