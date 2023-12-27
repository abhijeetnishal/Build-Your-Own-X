import { Kafka, logLevel } from "kafkajs";
import { savePost } from "../../service/postService";

// Kafka configuration for secured cluster
const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER], // Replace with your Kafka broker
  ssl: true,
  sasl: {
    mechanism: "plain", // Replace with your SASL mechanism
    username: process.env.KAFKA_USERNAME, // Replace with your username
    password: process.env.KAFKA_PASSWORD, // Replace with your password
  },
  logLevel: logLevel.ERROR,
});

const producer = kafka.producer();

const consumer = kafka.consumer({ groupId: "post-scheduler-workers" });

// Worker function
async function startWorker() {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "schedule_post", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const post = JSON.parse(message.value.toString());

          // Publish post based on scheduled time
          const now = new Date();
          if (now >= post.scheduledTime) {
            await savePost(post);
          } else {
            // Requeue the message if the scheduled time hasn't arrived yet
            const offsets = [{ topic, partition, offset: message.offset }];
            consumer.commitOffsets(offsets);
          }
        } catch (error) {
          console.error("Error processing message:", error);
          // Handle errors, potentially retry or send notifications
          // You might want to implement a retry mechanism or push the message to a dead-letter queue
        }
      },
    });
  } catch (error) {
    console.error("Error connecting to Kafka:", error);
  }
}

export { producer, consumer, startWorker };
