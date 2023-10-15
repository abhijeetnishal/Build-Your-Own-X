import { Request, Response } from "express";
import db from "../config/postgresConnect";
import redisConnect from "../config/redisConnect";

const getAllBlogPosts = async (req: Request, res: Response) => {
    try {
        //get req ip address
        const ipAddress = req.ip;

        //set limit
        const limit = 3;

        //get redis client from redisConnect.ts file
        const client = await redisConnect();

        //check if value is present in Redis or not
        const userCountDetail = await client.get(ipAddress);

        //if value is present(cache hit)
        if (userCountDetail) {
            //parse the value from string to number
            const currentCount = JSON.parse(userCountDetail);

            if(currentCount >= limit){
                //(429) too many requests
                return res.status(429).json({message: 'Rate Limit Exceeded. Please try again later.'});
            }
            else{
                //update the count in Redis(key, value) without affecting time with KEEPTTL option
                await client.set(ipAddress, JSON.stringify(currentCount + 1),{
                        KEEPTTL: true
                    }
                );

                //get data from DB
                const { rows } = await db.client.query(
                    `SELECT * FROM blog_post`,
                );

                //check if data exists or not
                if (rows.length === 0)
                    return res.status(404).json('no blog posts are created');
                else {
                    //return the data
                    return res.status(200).json(rows);
                }
            }
        }
        //if value is not present(cache miss)
        else {
            //get data from DB
            const { rows } = await db.client.query(
                `SELECT * FROM blog_post`,
            );

            //check if data exists or not
            if (rows.length === 0)
                return res.status(404).json('no blog posts are created');
            else {
                const count = 1;
                
                //store the data in Redis(key, value) with options
                await client.set(ipAddress, JSON.stringify(count), {
                    //set expiration time
                    EX: 40,
                    //not exist
                    NX: true
                });

                //return the data
                return res.status(200).json(rows);
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error\n" + error });
    }
}

export default {
    getAllBlogPosts
}