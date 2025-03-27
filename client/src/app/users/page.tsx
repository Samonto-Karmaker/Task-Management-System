"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { User } from "@/types/user";
import { useState } from "react";

export default function UserPage() {
    const [users, setUsers] = useState<User[]>([]);

    const toggleBlock = (userId: string) => {
        setUsers(() => {
            return users.map((user) => {
                if (user.id === userId) {
                    return {
                        ...user,
                        isBlocked: !user.isBlocked,
                    };
                }
                return user;
            });
        });
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">User Page</h1>
            <Button>Create User</Button>
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
                            <TableHead className="text-center p-3">
                                Actions
                            </TableHead>
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
                                    {user.permissionInfo.role}
                                </TableCell>
                                <TableCell className="p-3 text-center">
                                    <Button
                                        variant={
                                            user.isBlocked
                                                ? "destructive"
                                                : "default"
                                        }
                                        onClick={() => toggleBlock(user.id)}
                                    >
                                        {user.isBlocked ? "Unblock" : "Block"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </main>
    );
}
