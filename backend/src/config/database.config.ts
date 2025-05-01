import mongoose from 'mongoose';
import { MONGO_DB_URL, MONGO_DB_USER, MONGO_DB_PASSWORD} from "./env.config";

if (!MONGO_DB_URL) {
    throw new Error('Please specify the mongoDB URI environment variable inside .env<development/production>.local');
}

const databaseConnection = async (): Promise<void> => {
    try {
        const connect = await mongoose.connect(
            MONGO_DB_URL as string,
            {
                user: MONGO_DB_USER,
                pass: MONGO_DB_PASSWORD,
            }
        )
    } catch ( error: any ) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default databaseConnection;