import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";
import { NotificationType } from "../db/setupDB.js";
import { sendEmail } from "../util/sendEmail.js";
import { notificationQueue } from "../util/message-queue/queue.js";
import { redis } from "../util/redis.js";
import { getSocketIO } from "../util/socket.js";

export const createInAppNotification = async (content, sendTo) => {
    if (!content || !sendTo) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: sendTo },
            select: { id: true },
        });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const notification = await prisma.notification.create({
            data: {
                content,
                sendToId: sendTo,
            },
        });

        return notification.id;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getInAppNotifications = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const notifications = await prisma.notification.findMany({
            where: { sendToId: userId, type: NotificationType.IN_APP },
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });

        const notificationIds = notifications.map(
            (notification) => notification.id
        );
        const updateCount = await markNotificationsAsRead(notificationIds);
        console.log(
            `Marked ${updateCount} notifications as read for user ${userId}`
        );

        return notifications;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const markNotificationsAsRead = async (notificationIds) => {
    if (!notificationIds) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const notifications = await prisma.notification.updateMany({
            where: {
                id: { in: notificationIds },
                isRead: false,
            },
            data: { isRead: true },
        });
        return notifications.count;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getUnreadNotificationsCount = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const count = await prisma.notification.count({
            where: {
                sendToId: userId,
                isRead: false,
                type: NotificationType.IN_APP,
            },
        });
        return count;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const sendInAppNotification = async (notificationId) => {
    if (!notificationId) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
            select: { id: true, content: true, sendToId: true, isRead: true },
        });
        if (!notification) {
            throw new ApiError(404, "Notification not found");
        }

        // Logic to send the notification in real-time (e.g., using WebSocket)
        // Send notification to the user in real-time
        const socketId = await redis.get(`socket:${notification.sendToId}`);
        const io = getSocketIO(); // Get the Socket.IO instance
        if (socketId && io) {
            io.to(socketId).emit("notification", {
                notification: {
                    id: notification.id,
                    content: notification.content,
                    isRead: notification.isRead,
                },
            });
            console.log(`📢 Real-time notification sent to socket ${socketId}`);
        } else {
            console.log(`No socket found for user ${notification.sendToId}`);
        }

        return notification;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const createEmailNotification = async (content, sendTo) => {
    if (!content || !sendTo) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: sendTo },
            select: { id: true, email: true },
        });
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const notification = await prisma.notification.create({
            data: {
                content: content.body,
                sendToId: sendTo,
                type: NotificationType.EMAIL,
            },
        });

        return {
            notificationId: notification.id,
            emailSubject: content.subject,
            emailTo: user.email,
            emailText: content.body,
            emailHtml: content.html,
        };
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const sendEmailNotification = async (
    notificationId,
    emailData = undefined
) => {
    if (!notificationId) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
            select: { id: true, content: true, sendToId: true },
        });
        if (!notification) {
            throw new ApiError(404, "Notification not found");
        }

        // Logic to send the email notification (e.g., using an email service)
        let emailInfo;
        if (emailData) {
            // Send email using the provided emailData
            emailInfo = await sendEmail(
                emailData.to,
                emailData.subject,
                emailData.text,
                emailData.html
            );
        }

        return {
            notification,
            emailInfo,
        };
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const dispatchNotification = async (
    notificationId,
    type = NotificationType.IN_APP,
    emailData = undefined
) => {
    if (!notificationId) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        if (type === NotificationType.EMAIL) {
            await notificationQueue.add("sendNotification", {
                notificationId,
                emailData,
            });
        } else if (type === NotificationType.IN_APP) {
            await sendInAppNotification(notificationId);
        }
        return true;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const notifyEmail = async (sendTo, emailTemplate) => {
    const metadata = await createEmailNotification(emailTemplate, sendTo);

    const emailData = {
        subject: metadata.emailSubject,
        to: metadata.emailTo,
        text: metadata.emailText,
        html: metadata.emailHtml,
    };
    const isEnqueued = await dispatchNotification(
        metadata.notificationId,
        NotificationType.EMAIL,
        emailData
    );

    if (!isEnqueued) {
        throw new ApiError(500, "Failed to enqueue email notification");
    } else {
        console.log("Email notification enqueued successfully");
    }
};

export const notifyInApp = async (sendTo, content) => {
    const notificationId = await createInAppNotification(content, sendTo);
    const isEnqueued = await dispatchNotification(notificationId);

    if (!isEnqueued) {
        throw new ApiError(500, "Failed to enqueue email notification");
    } else {
        console.log("In-App notification enqueued successfully");
    }
};
