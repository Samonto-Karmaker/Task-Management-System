import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";

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

export const getInAppNotifications = async (userId) => {};

export const markNotificationsAsRead = async (notificationIds) => {};

export const sendInAppNotification = async (notificationId) => {};

export const createEmailNotification = async (content, sendTo) => {};

export const sendEmailNotification = async (notificationId) => {};
