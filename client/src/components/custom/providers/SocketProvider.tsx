// providers/SocketProvider.tsx
"use client";

import { ReactNode, useEffect, useRef, useState, createContext } from "react";
import { useUser } from "../hooks/useUser";
import io, { Socket } from "socket.io-client";

export interface SocketContextType {
    socket: typeof Socket | null;
    connectSocket: () => void;
    disconnectSocket: () => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();
    const socketRef = useRef<typeof Socket | null>(null);
    const [socket, setSocket] = useState<typeof Socket | null>(null);

    const connectSocket = () => {
        if (!user?.id) return;
        if (socketRef.current?.connected) {
            console.warn("Socket already connected");
            return;
        }

        const socketInstance = io("http://localhost:5000", {
            transports: ["websocket"],
            autoConnect: false,
        });

        socketInstance.connect();
        socketInstance.on("connect", () => {
            console.log("✅ Socket connected:", socketInstance.id);
            socketInstance.emit("user_connected", user.id);
        });

        socketInstance.on("disconnect", () => {
            console.log("❌ Socket disconnected:", socketInstance.id);
        });

        socketRef.current = socketInstance;
        setSocket(socketInstance);
    };

    const disconnectSocket = () => {
        if (socketRef.current?.connected) {
            socketRef.current.emit("user_disconnected", user?.id);
            socketRef.current.disconnect();
            console.log("Socket disconnected.");
            socketRef.current = null;
            setSocket(null);
        }
    };

    useEffect(() => {
        if (user?.id) {
            connectSocket();
        }

        return () => {
            disconnectSocket();
        };
    }, [user?.id]);

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};
