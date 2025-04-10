import { Worker } from "bullmq";
import { redis } from "../redis.js";
import {
    sendEmailNotification,
    sendInAppNotification,
} from "../../service/notification.service";
import { NotificationType } from "../../db/setupDB.js";

const worker = new Worker(
    "notificationQueue",
    async (job) => {
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
