"use client";

import { useRef } from "react";
import io, { Socket } from "socket.io-client";

interface UseSocketReturn {
    socket: typeof Socket | null;
    connectSocket: () => void;
    disconnectSocket: () => void;
}

export const useSocket = (userId?: string): UseSocketReturn => {
    const socketRef = useRef<typeof Socket | null>(null);

    const connectSocket = () => {
        if (!userId) return;
        if (socketRef.current?.connected) {
            console.warn("Socket is already connected");
            return;
        }

        const socket = io("http://localhost:5000", {
            transports: ["websocket"],
            autoConnect: false,
        });

        socket.connect();
        socket.on("connect", () => {
            console.log("✅ Socket connected:", socket.id);
            socket.emit("user_connected", userId);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket disconnected:", socket.id);
        });

        socketRef.current = socket;
    };

    const disconnectSocket = () => {
        if(socketRef.current && socketRef.current.connected) {
            socketRef.current.emit("user_disconnected", userId);
            socketRef.current.disconnect();
            console.log("Socket disconnected.");
            socketRef.current = null;
        }
    }

    return {
        socket: socketRef.current,
        connectSocket,
        disconnectSocket,
    };
};
