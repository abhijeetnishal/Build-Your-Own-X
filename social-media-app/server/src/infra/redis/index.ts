import { createClient } from "redis"

// Create a Redis instance to connect redis
const redisConnect = async () => {
    // Create client using Redis URL
    const client = createClient({
        url: process.env.Redis_URL
    });

    // Check for error
    client.on("error", function (err) {
        console.log(err);
    });

    // Connect to Redis
    await client.connect();
    //console.log('Redis connected successfully');

    // Return client to set and get the cache value
    return client;
}

export default redisConnect;