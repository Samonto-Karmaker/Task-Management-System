import { Worker } from "bullmq";
import { redis } from "../redis.js";
import { sendEmailNotification } from "../../service/notification.service.js";

console.log("Worker started");

const worker = new Worker(
    "notificationQueue",
    async (job) => {
        try {
            const { notificationId, emailData } = job.data;

            if (emailData) {
                await sendEmailNotification(notificationId, emailData);
            } else {
                await sendEmailNotification(notificationId);
            }
        } catch (error) {
            console.error("Error processing job:", error);
            throw error;
        }
    },
    {
        connection: redis,
    }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed successfully`);
});
worker.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
});
