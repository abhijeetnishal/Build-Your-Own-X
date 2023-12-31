import { Kafka } from "@upstash/kafka";

// Kafka configuration for secured cluster
const kafka = new Kafka({
  url: process.env.KAFKA_BROKER as string,
  username: process.env.KAFKA_USERNAME as string,
  password: process.env.KAFKA_PASSWORD as string,
});

const producer = kafka.producer();
const consumer = kafka.consumer();

export { producer, consumer };
