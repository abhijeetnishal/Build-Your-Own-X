import { Request, Response } from "express";
import db from "../config/postgresConnect";

const createSchemas = async (req: Request, res: Response) => {
    try {
        //Connect to the PostgreSQL server
        db.connect;

        // Create the schemas
        await db.client.query(
            `
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            
            CREATE TABLE IF NOT EXISTS blog_post (
                _id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
                author VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
            `
        );
        res.status(200).json('Schemas created successfully!');
    }
    catch (error) {
        console.error('error creating schemas:', error);
        res.status(500).json('internal server error')
    }
}

export default createSchemas;