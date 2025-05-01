import { Router } from 'express';
import { logIn, logOut, signUp } from "../controllers/auth.controller";

const authRoute = Router();

authRoute.post('/sign-up', signUp);

authRoute.post('/login', logIn);

authRoute.post('/logout', logOut);

export default authRoute;