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
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/api-response";
import apiClient from "@/lib/apiClient";
import { useUser } from "@/components/custom/hooks/useUser";
import { checkPermission } from "@/utils/checkPermission";
import Unauthorized from "@/components/custom/Unauthorized";
import { useRouter } from "next/navigation";

interface AssignAbleUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface FormData {
    title: string;
    description: string;
    deadline: string;
    priority: Priority;
    assigneeId: string;
}

export default function CreateTaskForm() {
    const [assignableUsers, setAssignableUsers] = useState<AssignAbleUser[]>(
        []
    );
    const hasAssignableUsersFetched = useRef(false);
    const router = useRouter();

    const { user } = useUser();
    const isAuthorized =
        checkPermission(user, "CREATE_TASK") &&
        checkPermission(user, "ASSIGN_TASK");

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors },
    } = useForm<FormData>()

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

        if (isAuthorized) {
            fetchAssignAbleUsers();
        }
    }, [isAuthorized]);

    const onSubmit = async (data: FormData) => {
        try {
            const response: ApiResponse = await apiClient.post("/task", {
                title: data.title,
                description: data.description,
                deadline: new Date(data.deadline).toISOString(),
                priority: data.priority,
                assigneeId: data.assigneeId,
            });
            if (response.success) {
                console.log("Task created successfully");
                setValue("title", "");
                setValue("description", "");
                setValue("deadline", "");
                setValue("priority", Priority.LOW);
                setValue("assigneeId", "");

                setError("title", { message: "" });
                setError("description", { message: "" });
                setError("deadline", { message: "" });
                setError("priority", { message: "" });
                setError("assigneeId", { message: "" });

                alert("Task created successfully!");
                router.push("/tasks");
            } else if (response.statusCode === 400 && response.data) {
                const errors = response.data;
                if (errors.title) {
                    setError("title", { message: errors.title.msg });
                }
                if (errors.description) {
                    setError("description", { message: errors.description.msg });
                }
                if (errors.deadline) {
                    setError("deadline", { message: errors.deadline.msg });
                }
                if (errors.priority) {
                    setError("priority", { message: errors.priority.msg });
                }
                if (errors.assigneeId) {
                    setError("assigneeId", { message: errors.assigneeId.msg });
                }
            } else {
                console.error("Error creating task:", response.message);
                alert(`Error creating task: ${response.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred. Please try again later.");
        }
    };

    if (!isAuthorized) {
        return <Unauthorized />;
    }

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Create Task
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <Label>Select Assignee</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("assigneeId", value);
                                }}
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an Assignee" />
                                </SelectTrigger>
                                <SelectContent>
                                    {assignableUsers.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={String(user.id)}
                                        >
                                            {user.name} - {user.email} -{" "}
                                            {user.role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.assigneeId && (
                                <p className="text-sm text-red-500">
                                    {errors.assigneeId.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input 
                                id="Title" 
                                placeholder="Task Title" 
                                {...register("title", {
                                    required: "Title is required",
                                    minLength: {
                                        value: 3,
                                        message: "Title must be at least 3 characters",
                                    },
                                    maxLength: {
                                        value: 127,
                                        message: "Title must be at most 127 characters",
                                    },
                                })}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                type="text"
                                id="description"
                                placeholder="Task Description"
                                {...register("description", {
                                    required: "Description is required",
                                    minLength: {
                                        value: 3,
                                        message:
                                            "Description must be at least 3 characters",
                                    },
                                    maxLength: {
                                        value: 255,
                                        message:
                                            "Description must be at most 255 characters",
                                    },
                                })}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                type="date"
                                id="deadline"
                                placeholder="Select a date"
                                {...register("deadline", {
                                    required: "Deadline is required",
                                    validate: (value) => {
                                        const today = new Date().setHours(0, 0, 0, 0);
                                        const selectedDate = new Date(value).setHours(0, 0, 0, 0);
                                        if (selectedDate < today) {
                                            return "Deadline must be in the future";
                                        }
                                        return true;
                                    },
                                })}
                            />
                        </div>
                        {errors.deadline && (
                            <p className="text-sm text-red-500">
                                {errors.deadline.message}
                            </p>
                        )}
                        <div className="space-y-2">
                            <Label>Select Priority</Label>
                            <Select
                                onValueChange={(value) => {
                                    setValue("priority", value as Priority);
                                }}
                                defaultValue={String(Priority.LOW)}
                                required
                            >
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
                            {errors.priority && (
                                <p className="text-sm text-red-500">
                                    {errors.priority.message}
                                </p>
                            )}
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
