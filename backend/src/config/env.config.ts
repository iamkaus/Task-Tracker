import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

if (!process.env.JWT_SECRET) {
    throw new Error('Missing JWT_SECRET in environment variables');
}

export const PORT = process.env.PORT || '5000';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGO_DB_URL = process.env.MONGO_DB_URL || '';
export const MONGO_DB_USER = process.env.MONGO_DB_USER || '';
export const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || '';
export const JWT_SECRET = process.env.JWT_SECRET;
