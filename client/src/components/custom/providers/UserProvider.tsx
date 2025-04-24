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
import { useRouter } from "next/navigation";
import Loading from "../Loading";

// Context type definition
interface UserContextType {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    loading: boolean;
}

// Create context with a default value
export const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    loading: true,
});

// Provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response: ApiResponse = await apiClient.get("/me");
                if (response.success) {
                    const loggedInUser = response.data as User;
                    setUser(loggedInUser);

                    // Redirect if the user must change their password
                    if (loggedInUser.mustChangePassword) {
                        router.push("/change-password");
                    }
                } else {
                    setUser(null);
                    router.push("/login");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    // Prevent rendering children until the user fetch is complete
    if (loading) {
        return <Loading />;
    }

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
