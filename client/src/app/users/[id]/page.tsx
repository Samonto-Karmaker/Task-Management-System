"use client";

import Dashboard, { OtherUser } from "@/components/custom/Dashboard";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";
import Loading from "@/components/custom/Loading";
import { checkPermission } from "@/utils/checkPermission";
import { useUser } from "@/components/custom/hooks/useUser";
import { UserPermissions } from "@/utils/constant";
import Unauthorized from "@/components/custom/Unauthorized";

export default function UserPage() {
    const { id } = useParams();
    const [otherUser, setOtherUser] = useState<OtherUser | undefined>(
        undefined
    );
    const [loading, setLoading] = useState(true);

    const { user } = useUser();
    const canViewUser = checkPermission(user, UserPermissions.VIEW_USER);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response: ApiResponse = await apiClient.get(`/user/${id}`);
                if (response.success) {
                    setOtherUser(response.data);
                } else {
                    console.error(
                        "Failed to fetch user data:",
                        response.message
                    );
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert(
                    "An error occurred while fetching user data. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        if (canViewUser && id) {
            fetchUser();
        }
    }, [id, canViewUser]);

    if (!canViewUser) return <Unauthorized />;
    if (loading) return <Loading />;

    return <Dashboard otherUser={otherUser} />;
}
