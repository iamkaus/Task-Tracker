import { config } from 'dotenv'
config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})

export const {
    PORT,
    NODE_ENV,
    MONGO_DB_URL,
    MONGO_DB_USER,
    MONGO_DB_PASSWORD,
} = process.env