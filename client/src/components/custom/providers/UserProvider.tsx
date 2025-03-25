"use client";

import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";
import { User } from "@/types/user";
import {
    createContext,
    ReactNode,
    useState,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";

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
