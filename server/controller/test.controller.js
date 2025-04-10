import ApiResponse from "../util/ApiResponse.js";
import {
    setNotificationInRedis,
    getNotificationFromRedis,
} from "../util/redis.js";

export const testController = (req, res) => {
    res.status(200).json(new ApiResponse(200, "Test controller is working"));
};

export const testRedisController = async (req, res) => {
    const testNotification = {
        id: 1,
        content: "Test Notification",
    };
    await setNotificationInRedis(testNotification.id, testNotification);
    const response = await getNotificationFromRedis(testNotification.id);
    if (response) {
        res.status(200).json(
            new ApiResponse(200, "Notification set in Redis", response)
        );
    } else {
        res.status(500).json(
            new ApiResponse(500, "Failed to get notification from Redis")
        );
    }
};
