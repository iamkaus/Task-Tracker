import express, {Application, Request, Response} from 'express'
import cors from 'cors'
import { NODE_ENV, PORT } from "./config/env.config"
import authRoute from "./routes/auth.route";
import projectRoute from "./routes/project.route";
import taskRoute from "./routes/task.route";
import databaseConnection from "./config/database.config";

(async (): Promise<void> => {
    try {
        await databaseConnection();
        console.log("Database Connected");
    } catch ( error: any) {
        console.error( `Error connecting to database: ${error.message}` );
    }

    const app: Application = express();

    /**
     * @description
     * Initialize built-in middlewares:
     * - express.json() parses incoming JSON payloads into req.body.
     * - cors() enables Cross-Origin Resource Sharing to handle requests from different origins.
     */

    app.use(express.json());
    app.use(cors());

    /**
     * @description
     * Define API routes for authentication, projects, and tasks.
     * These route handlers are imported from their respective modules.
     */

    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/projects', projectRoute);
    app.use('/api/v1/tasks', taskRoute);

    /**
     * @route GET /
     * @description
     * Root endpoint for basic API health check.
     * @access Public
     */

    app.get('/', (req: Request, res: Response): void => {
        res.json({
            success: true,
            message: 'Welcome to Task Tracker API',
        });
    });

    /**
     * @description
     * Starts the Express server on the defined PORT.
     * Logs the URL and running mode upon successful startup.
     */

    const server = app.listen(PORT, () => {
        console.log(`Task Tracker API is running on: http://localhost:${PORT} in ${NODE_ENV} mode`);
    })

    /**
     * @description
     * Global error handler for unhandled promise rejections.
     * Logs the error and gracefully shuts down the server before exiting the process.
     */

    process.on('unhandledRejection', (err: Error, promise) => {
        console.error(`Error: ${err.message}`);

        server.close(() => process.exit(1));
    })
})();