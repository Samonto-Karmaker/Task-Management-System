"use client";

import { useUser } from "@/components/custom/hooks/useUser";
import Unauthorized from "@/components/custom/Unauthorized";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";
import { checkPermission } from "@/utils/checkPermission";
import { UserPermissions } from "@/utils/constant";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserBaseInfo {
    id: string;
    name: string;
    email: string;
    isBlocked: boolean;
    role: {
        id: string;
        name: string;
    };
}

export default function UserPage() {
    const [users, setUsers] = useState<UserBaseInfo[]>([]);
    const { user } = useUser();
    const canBlock = checkPermission(user, UserPermissions.BLOCK_USER);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response: ApiResponse = await apiClient.get("/");
                if (response.success) {
                    console.log(response.data);
                    setUsers(response.data);
                } else {
                    console.error(response.message);
                    alert(`Failed to fetch users: ${response.message}`);
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred. Please try again later.");
            }
        };

        if (checkPermission(user, UserPermissions.VIEW_USERS)) {
            fetchUsers();
        }
    }, [user]);

    const toggleBlock = async (userId: string) => {
        try {
            const response: ApiResponse = await apiClient.patch(
                `/toggle-block/${userId}`,
                {}
            );
            if (response.success) {
                const updatedUser = response.data;
                setUsers(() => {
                    return users.map((user) => {
                        if (user.id === userId) {
                            return {
                                ...user,
                                isBlocked: updatedUser.isBlocked,
                            };
                        }
                        return user;
                    });
                });
                alert(
                    `User "${updatedUser.name}" has been ${
                        updatedUser.isBlocked ? "blocked" : "unblocked"
                    }`
                );
            } else {
                console.error(response.message);
                alert(`Failed to toggle block status: ${response.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again later.");
        }
    };

    if (!(
        checkPermission(user, UserPermissions.VIEW_USERS) ||
        checkPermission(user, UserPermissions.BLOCK_USER) ||
        checkPermission(user, UserPermissions.CREATE_USER)
    )) {
        return <Unauthorized />;
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">All Users Dashboard</h1>
            <Link href="/create-user">
                <Button>Create User</Button>
            </Link>
            <hr className="my-8" />
            <div className="overflow-x-auto">
                <Table className="min-w-full border border-gray-200 rounded-md">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="text-left p-3">
                                Username
                            </TableHead>
                            <TableHead className="text-left p-3">
                                Email
                            </TableHead>
                            <TableHead className="text-left p-3">
                                Role
                            </TableHead>
                            {canBlock ? (
                                <TableHead className="text-left p-3">
                                    Block/Unblock
                                </TableHead>
                            ) : (
                                <TableHead className="text-left p-3">
                                    Status
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="border-b">
                                <TableCell className="p-3">
                                    {user.name}
                                </TableCell>
                                <TableCell className="p-3">
                                    {user.email}
                                </TableCell>
                                <TableCell className="p-3">
                                    {user.role.name}
                                </TableCell>
                                {canBlock ? (
                                    <TableCell className="p-3 text-center">
                                        <Button
                                            variant={
                                                user.isBlocked
                                                    ? "destructive"
                                                    : "default"
                                            }
                                            onClick={() => toggleBlock(user.id)}
                                        >
                                            {user.isBlocked
                                                ? "Unblock"
                                                : "Block"}
                                        </Button>
                                    </TableCell>
                                ) : (
                                    <TableCell className="p-3 text-center">
                                        {user.isBlocked ? "Blocked" : "Active"}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}
