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
        console.log(`Socket connected: ${socket.id}`);

        // Add user during login
        socket.on("user_connected", async (userId) => {
            try {
                await redis.set(userId, socket.id, "EX", 86400);
                console.log(
                    `User ${userId} connected with socket ID: ${socket.id}`
                );
            } catch (error) {
                console.error(`Error adding user to Redis: ${error.message}`);
            }
        });

        // Remove user during logout
        socket.on("user_disconnected", async (userId) => {
            try {
                await redis.del(userId);
                console.log(`User ${userId} disconnected`);
            } catch (error) {
                console.error(`Error removing user from Redis: ${error.message}`);
            }
        });

        // Handle socket disconnection
        socket.on("disconnect", async () => {
            console.log(`Socket disconnected: ${socket.id}`);
            // Optionally, clean up Redis entries for this socket ID
        });
    });

    return {
        server,
        io,
    };
};