import { Worker } from "bullmq";
import { redis } from "../redis.js";
import {
    sendEmailNotification,
    sendInAppNotification,
} from "../../service/notification.service.js";
import { NotificationType } from "../../db/setupDB.js";

console.log("Worker started");

const worker = new Worker(
    "notificationQueue",
    async (job) => {
        try {
            const { notificationId, type, emailData } = job.data;

            if (type === NotificationType.IN_APP) {
                await sendInAppNotification(notificationId);
            } else if (type === NotificationType.EMAIL) {
                if (emailData) {
                    await sendEmailNotification(notificationId, emailData);
                } else {
                    await sendEmailNotification(notificationId);
                }
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
