import { Router } from 'express';
import {getMe, logIn, signUp} from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post('/sign-up', signUp);

authRoute.post('/login', logIn);

authRoute.get('/getMe/:id', getMe);

export default authRoute;