import mongoose, { ConnectOptions } from 'mongoose'
import dotenv from 'dotenv';

// Configure env
dotenv.config();

// Create and export a function to house the connection:
async function dbConnect() {
    // Use mongoose to connect this application to our database using the MONGO_URI (connection string)
    mongoose.set('strictQuery', true);
    mongoose.connect(
        process.env.MONGO_URI,
        {
            // These are options to ensure that the connection is done properly
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions
    )
    // Use a then catch block to show if the connection was successful or not:
    .then(() => {
        console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
        console.log("Unable to connect to MongoDB Atlas!");
        console.error(error);
    });
}

export default dbConnect;