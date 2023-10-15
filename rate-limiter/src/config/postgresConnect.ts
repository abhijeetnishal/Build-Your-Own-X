import { Client } from "pg";

require('dotenv').config();

//Create a new PostgreSQL client instance
const prodConnection = { connectionString: process.env.DB_URL_PROD, ssl: true };
const client = new Client(prodConnection);

//Connect to the PostgreSQL server
const connect = client.connect((err) => {
    if (err)
        console.error('Error connecting to PostgreSQL: ', err.stack);
    else
        console.log('Connected to PostgreSQL database');
});

export default { client, connect };