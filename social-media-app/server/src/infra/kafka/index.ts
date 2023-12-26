import { Kafka, logLevel } from "kafkajs";

// Kafka configuration for secured cluster
const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER], // Replace with your Kafka broker
  ssl: true,
  sasl: {
    mechanism: "scram-sha-256", // Replace with your SASL mechanism
    username: process.env.KAFKA_USERNAME, // Replace with your username
    password: process.env.KAFKA_PASSWORD, // Replace with your password
  },
  logLevel: logLevel.ERROR,
});

const producer = kafka.producer();

const consumer = kafka.consumer({ groupId: "post-scheduler-workers" });

export { producer, consumer };
