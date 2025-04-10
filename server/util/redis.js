import Redis from "ioredis";
import dotenv from "dotenv";
import ApiError from "./ApiError.js";

dotenv.config();

export const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT) || 6379,
    retryStrategy: function (times) {
        if (times > 5) {
            return undefined; // Stop retrying after 5 attempts
        }
        return Math.min(times * 100, 3000); // Exponentially back off retries
    },
    maxRetriesPerRequest: null, // No limit on retries per request
});

// Just for testing redis connection
export const setNotificationInRedis = async (id, content) => {
    try {
        if (!id || !content) {
            throw new ApiError(400, "Missing required fields");
        }
        const notificationKey = `notification:${id}`;
        const notificationValue = JSON.stringify(content);
        await redis.set(notificationKey, notificationValue, "EX", 60 * 60 * 24); // Set expiration to 24 hours
        return true;
    } catch (error) {
        console.error("Error setting notification in Redis:", error);
        throw new ApiError(500, "Failed to set notification in Redis");
    }
};

export const getNotificationFromRedis = async (id) => {
    try {
        if (!id) {
            throw new ApiError(400, "Missing required fields");
        }
        const notificationKey = `notification:${id}`;
        const notificationValue = await redis.get(notificationKey);
        if (!notificationValue) {
            return null;
        }
        return JSON.parse(notificationValue);
    } catch (error) {
        console.error("Error getting notification from Redis:", error);
        throw new ApiError(500, "Failed to get notification from Redis");
    }
};
