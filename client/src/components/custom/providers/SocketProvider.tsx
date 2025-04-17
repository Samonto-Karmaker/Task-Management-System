"use client";

import { useEffect, ReactNode } from "react";
import { useUser } from "../hooks/useUser";
import { useSocket } from "../hooks/useSocket";

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useUser();
    const { connectSocket, disconnectSocket } = useSocket(user?.id);
    useEffect(() => {
        if (user?.id) {
            connectSocket();
        }

        return () => {
            disconnectSocket();
        };
    }, [user?.id, connectSocket, disconnectSocket]);

    return <>{children}</>;
};
