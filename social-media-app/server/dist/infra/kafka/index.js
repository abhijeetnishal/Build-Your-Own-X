"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumer = exports.producer = void 0;
const kafka_1 = require("@upstash/kafka");
// Kafka configuration for secured cluster
const kafka = new kafka_1.Kafka({
    url: process.env.KAFKA_BROKER,
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
});
const producer = kafka.producer();
exports.producer = producer;
const consumer = kafka.consumer();
exports.consumer = consumer;
//# sourceMappingURL=index.js.map