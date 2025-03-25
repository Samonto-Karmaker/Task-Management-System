"use client";

import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";
import {
    createContext,
    ReactNode,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";

// User type definition
interface User {
    id: string;
    email: string;
    name: string;
    roleId: string;
    isBlocked: boolean;
    createdAt: string;
    updatedAt: string;
}

// Context type definition
interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
}

// Create context without default value (safer)
export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response: ApiResponse = await apiClient.get("/me");
                if (response.success) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error(error);
                setUser(null);
            }
        }

        fetchUser();
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
