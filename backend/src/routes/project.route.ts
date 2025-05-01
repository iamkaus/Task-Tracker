import { Router } from 'express';
import {
    createProject,
    deleteProjectById,
    getProjectById,
    getProjects,
    updateProjectById
} from "../controllers/project.controller";

const projectRoute = Router();

projectRoute.post('/create-project', createProject);

projectRoute.get('/get-projects', getProjects);

projectRoute.get('/get-project/:id', getProjectById);

projectRoute.put('update-project/:id', updateProjectById);

projectRoute.delete('/delete-project/:id', deleteProjectById);

export default projectRoute;