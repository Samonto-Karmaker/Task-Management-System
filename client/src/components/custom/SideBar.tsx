"use client";

import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { Home, Bell, ListChecks, Menu, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useUser } from "./hooks/useUser";
import { checkPermission } from "@/utils/checkPermission";
import { User } from "@/types/user";
import { UserPermissions } from "@/utils/constant";
import { ApiResponse } from "@/types/api-response";
import apiClient from "@/lib/apiClient";
import { usePathname } from "next/navigation";
import { useSocket } from "./hooks/useSocket";

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
    const { user } = useUser();
    const { socket } = useSocket();

    const pathname = usePathname();

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    useEffect(() => {
        const fetchUnreadNotificationsCount = async () => {
            try {
                const response: ApiResponse = await apiClient.get(
                    "/notification/unread-notifications-count"
                );
                if (response.success) {
                    setUnreadNotificationsCount(response.data);
                } else {
                    console.error("Error fetching unread notifications count");
                }
            } catch (error) {
                console.error(
                    "Error fetching unread notifications count:",
                    error
                );
            }
        };

        if (user) {
            fetchUnreadNotificationsCount();
        }
    });

    useEffect(() => {
        if (socket && socket.connected) {
            socket.on("notification", () => {
                setUnreadNotificationsCount((prevCount) => prevCount + 1);
            });
            console.log("Socket connected for notifications");
        } else {
            console.log("Socket not connected for notifications");
        }

        return () => {
            if (socket) {
                socket.off("notification");
            }
        };
    }, [socket, socket?.connected]);

    useEffect(() => {
        if (pathname === "/notifications") setUnreadNotificationsCount(0);
    }, [pathname]);

    if (!user || !user.roleId) return <></>;

    return (
        <div className="flex">
            <aside
                className={`sticky top-0 left-0 flex flex-col bg-gray-900 text-white h-screen p-4 transition-all ${
                    isExpanded ? "w-60" : "w-16"
                }`}
            >
                <Button
                    variant="ghost"
                    className="mb-6"
                    onClick={toggleSidebar}
                >
                    {isExpanded ? <X size={24} /> : <Menu size={24} />}
                </Button>
                <SidebarContent
                    user={user}
                    isExpanded={isExpanded}
                    unreadNotificationsCount={unreadNotificationsCount}
                    setUnreadNotificationsCount={setUnreadNotificationsCount}
                />
            </aside>
        </div>
    );
};

const SidebarContent = ({
    user,
    isExpanded = true,
    unreadNotificationsCount = 0,
    setUnreadNotificationsCount = () => {},
}: {
    user: User;
    isExpanded?: boolean;
    unreadNotificationsCount?: number;
    setUnreadNotificationsCount?: Dispatch<SetStateAction<number>>;
}) => {
    const links = [
        { name: "Home", href: "/", icon: Home },
        { name: "Task", href: "/tasks", icon: ListChecks },
        { name: "Notifications", href: "/notifications", icon: Bell },
    ];

    if (
        checkPermission(user, UserPermissions.VIEW_USERS) ||
        checkPermission(user, UserPermissions.BLOCK_USER) ||
        checkPermission(user, UserPermissions.CREATE_USER)
    ) {
        links.push({ name: "User", href: "/users", icon: Users });
    }

    return (
        <nav className="flex flex-col space-y-4">
            {links.map(({ name, href, icon: Icon }) => {
                const isNotification = name === "Notifications";
                const showBadge =
                    isNotification && unreadNotificationsCount > 0;

                return (
                    <Link
                        key={name}
                        href={href}
                        className={`flex items-center gap-3 p-3 rounded-md ${
                            isExpanded ? "justify-between" : "justify-center"
                        } ${
                            isNotification
                                ? "bg-gray-800 hover:bg-gray-700"
                                : "hover:bg-gray-800"
                        }`}
                        onClick={() => {
                            if (isNotification) {
                                setUnreadNotificationsCount(0);
                            }
                        }}
                    >
                        <div className="relative">
                            <Icon size={24} />
                            {showBadge && !isExpanded && (
                                <span
                                    className="absolute -top-1 -right-1 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center"
                                    title={`${unreadNotificationsCount} unread`}
                                >
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </div>
                        {isExpanded && (
                            <>
                                <span className="flex-1">{name}</span>
                                {showBadge && (
                                    <span className="ml-auto bg-red-500 text-xs text-white rounded-full px-2 py-0.5">
                                        {unreadNotificationsCount}
                                    </span>
                                )}
                            </>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
};

export default Sidebar;
