import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";
import { NotificationType } from "@prisma/client";

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
        markNotificationsAsRead(notificationIds);

        return notifications;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const markNotificationsAsRead = async (notificationIds) => {
    if (!notificationIds || notificationIds.length === 0) {
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
            where: { sendToId: userId, isRead: false },
        });
        return count;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const sendInAppNotification = async (
    notificationId,
    isRealTime = false
) => {
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
        if (isRealTime) {
            // Send notification to the user in real-time
        }

        return notification;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const createEmailNotification = async (content, sendTo) => {};

export const sendEmailNotification = async (notificationId) => {};
