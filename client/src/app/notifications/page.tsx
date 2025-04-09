"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ApiResponse } from "@/types/api-response";
import apiClient from "@/lib/apiClient";
import { useUser } from "@/components/custom/hooks/useUser";
import Loading from "@/components/custom/Loading";
import Unauthorized from "@/components/custom/Unauthorized";
import EmptyTable from "@/components/custom/EmptyTable";

interface Notification {
    id: string;
    content: string;
    createdAt: string;
    isRead?: boolean;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [expandedNotifications, setExpandedNotifications] = useState<
        string[]
    >([]);
    const [loading, setLoading] = useState(true);

    const { user } = useUser();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response: ApiResponse = await apiClient.get(
                    "/notification/in-app-notifications"
                );
                if (response.success) {
                    setNotifications(response.data);
                } else {
                    console.error(
                        "Failed to fetch notifications:",
                        response.message
                    );
                    alert(
                        "Failed to fetch notifications. Please try again later."
                    );
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                alert("An error occurred while fetching notifications.");
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const toggleReadMore = (id: string) => {
        setExpandedNotifications((prev) =>
            prev.includes(id)
                ? prev.filter((notificationId) => notificationId !== id)
                : [...prev, id]
        );
    };

    if (!user) return <Unauthorized />;
    if (loading) return <Loading />;
    if (notifications.length === 0) return <EmptyTable />;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="space-y-4">
                {notifications.map((notification) => {
                    const isExpanded = expandedNotifications.includes(
                        notification.id
                    );
                    const shouldTruncate =
                        notification.content.length > 100 && !isExpanded;

                    return (
                        <Card key={notification.id}>
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">
                                    Notification
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700">
                                    {shouldTruncate
                                        ? `${notification.content.slice(
                                              0,
                                              100
                                          )}...`
                                        : notification.content}
                                    {notification.content.length > 100 && (
                                        <Button
                                            variant="link"
                                            className="text-blue-500"
                                            onClick={() =>
                                                toggleReadMore(notification.id)
                                            }
                                        >
                                            {isExpanded
                                                ? "Read Less"
                                                : "Read More"}
                                        </Button>
                                    )}
                                </p>
                                <Badge className="mt-4">
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </Badge>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
