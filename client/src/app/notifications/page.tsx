"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Dummy data for notifications
const dummyNotifications = [
    {
        id: "1",
        content:
            "You have been assigned a new task: Design the login page. Please complete it by the end of the week.",
        createdAt: "2025-04-09T10:30:00Z",
    },
    {
        id: "2",
        content:
            "The status of your task 'Update Dashboard UI' has been updated to 'In Progress'.",
        createdAt: "2025-04-08T14:15:00Z",
    },
    {
        id: "3",
        content:
            "Your task 'Fix Navbar Bug' has been reassigned to another team member.",
        createdAt: "2025-04-07T09:00:00Z",
    },
    {
        id: "4",
        content:
            "This is a very long notification content that exceeds the usual length. It contains detailed information about the task and additional instructions. Please make sure to read the full content to understand the requirements.",
        createdAt: "2025-04-06T16:45:00Z",
    },
];

export default function NotificationsPage() {
    const [expandedNotifications, setExpandedNotifications] = useState<
        string[]
    >([]);

    const toggleReadMore = (id: string) => {
        setExpandedNotifications((prev) =>
            prev.includes(id)
                ? prev.filter((notificationId) => notificationId !== id)
                : [...prev, id]
        );
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            <div className="space-y-4">
                {dummyNotifications.map((notification) => {
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
