import {
    getInAppNotifications,
    getUnreadNotificationsCount,
} from "../service/notification.service.js";
import ApiResponse from "../util/ApiResponse.js";
import { finalResErrorHandler } from "../util/finalResErrorHandler.js";

export const getInAppNotificationsController = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await getInAppNotifications(userId);
        res.status(200).json(
            new ApiResponse(
                200,
                "In-app notifications fetched successfully",
                notifications
            )
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getUnreadNotificationsCountController = async (req, res) => {
    try {
        const userId = req.user.id;
        const unreadCount = await getUnreadNotificationsCount(userId);
        res.status(200).json(
            new ApiResponse(
                200,
                "Unread notifications count fetched successfully",
                unreadCount
            )
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};
