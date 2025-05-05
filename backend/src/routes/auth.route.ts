import { Router } from 'express';
import { getMe, logIn, signUp } from "../controllers/auth.controller";
import {userAuthenticationMiddleware} from "../middleware/auth.middleware";

/**
 * @constant authRoute
 * @description Express router for handling authentication-related routes.
 */
const authRoute = Router();

/**
 * @route POST /api/v1/auth/sign-up
 * @description Registers a new user account.
 * @access Public
 */
authRoute.post('/sign-up', signUp);

/**
 * @route POST /api/v1/auth//login
 * @description Authenticates an existing user and returns a JWT token.
 * @access Public
 */
authRoute.post('/login', logIn);

/**
 * @route GET /api/v1/auth//getMe
 * @description Retrieves the currently authenticated user's information based on the JWT token.
 * @access Private
 */
authRoute.get('/getMe', userAuthenticationMiddleware, getMe);

/**
 * @exports authRoute
 * @description Exports the configured authentication router.
 */
export default authRoute;
