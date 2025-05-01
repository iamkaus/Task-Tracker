import { Router } from 'express';
import {createTask, deleteTaskById, getTasks, getTaskById, updateTaskById} from "../controllers/task.controller";

const taskRoute = Router();

taskRoute.post('/create-task', createTask);

taskRoute.get('/get-tasks', getTasks);

taskRoute.get('/get-task/:id', getTaskById);

taskRoute.put('/update-tasks/:id', updateTaskById);

taskRoute.delete('/delete-tasks/:id', deleteTaskById);

export default taskRoute;