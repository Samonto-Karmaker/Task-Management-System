import { useEffect, useRef } from "react";
import io from "socket.io-client";

export const useSocket = (userId?: string) => {
    const socketRef = useRef<SocketIOClient.Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const socket = io("http://localhost:5000", {
            transports: ["websocket"],
            autoConnect: false,
        });

        socket.connect();

        socket.on("connect", () => {
            socket.emit("user_connected", userId);
            console.log("Connected to socket server");
        });

        socketRef.current = socket;

        return () => {
            if (socketRef.current) {
                socketRef.current.emit("user_disconnected", userId);
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [userId]);

    return socketRef.current;
};
