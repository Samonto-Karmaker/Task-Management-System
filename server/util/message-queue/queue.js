import { Queue } from "bullmq";
import { redis } from "../redis.js";

export const notificationQueue = new Queue("notificationQueue", {
    connection: redis,
});