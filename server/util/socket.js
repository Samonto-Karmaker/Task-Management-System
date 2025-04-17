import http from "http";
import { Server } from "socket.io";
import { redis } from "./redis.js";

export const createSocketServer = (app) => {
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "http://localhost:3000",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`✅ Socket connected: ${socket.id}`);

        socket.on("user_connected", async (userId) => {
            try {
                await redis.set(`socket:${userId}`, socket.id, "EX", 86400); // 1 day expiry
                console.log(
                    `User ${userId} connected with socket ID: ${socket.id}`
                );
            } catch (error) {
                console.error(
                    `❌ Error adding user to Redis: ${error.message}`
                );
            }
        });

        socket.on("user_disconnected", async (userId) => {
            try {
                await redis.del(`socket:${userId}`);
                console.log(`User ${userId} disconnected`);
            } catch (error) {
                console.error(
                    `❌ Error removing user from Redis: ${error.message}`
                );
            }
        });

        socket.on("disconnect", async () => {
            console.log(`❌ Socket disconnected: ${socket.id}`);
            try {
                const keys = await redis.keys("socket:*");
                for (const key of keys) {
                    const value = await redis.get(key); // now safe
                    if (value === socket.id) {
                        await redis.del(key);
                        console.log(
                            `🧹 Cleaned up Redis entry for user: ${key}`
                        );
                        break;
                    }
                }
            } catch (error) {
                console.error(
                    `❌ Error cleaning up Redis on disconnect: ${error.message}`
                );
            }
        });
    });

    return {
        server,
        io,
    };
};
