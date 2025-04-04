"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Priority } from "@/utils/constant";
import { useEffect, useState } from "react";
import { ApiResponse } from "@/types/api-response";
import apiClient from "@/lib/apiClient";
import { useRef } from "react";

interface AssignAbleUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function CreateTaskForm() {
    const [assignableUsers, setAssignableUsers] = useState<AssignAbleUser[]>([]);
    const hasAssignableUsersFetched = useRef(false);

    useEffect(() => {
        const fetchAssignAbleUsers = async () => {
            if (!hasAssignableUsersFetched.current) {
                try {
                    const response: ApiResponse = await apiClient.get(
                        "/task/assignable-users"
                    );
                    if (response.success) {
                        setAssignableUsers(response.data);
                        hasAssignableUsersFetched.current = true; // Mark as fetched
                    } else {
                        console.error(response.message);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchAssignAbleUsers();
    }, []);

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create Task
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                    <div className="space-y-2">
                            <Label>Select Assignee</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an Assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assignableUsers.map((user) => (
                                        <SelectItem key={user.id} value={String(user.id)}>
                                            {user.name} - {user.email} - {user.role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="Title" placeholder="Task Title" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                type="text"
                                id="description"
                                placeholder="Task Description"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                type="date"
                                id="deadline"
                                placeholder="Select a date"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Select Priority</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(Priority).map((p) => (
                                        <SelectItem key={p} value={String(p)}>
                                            {p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 text-white rounded px-4 py-2"
                        >
                            Create Task
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
