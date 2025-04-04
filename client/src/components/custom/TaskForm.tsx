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

interface TaskFormProps {
    mode: "create" | "update";
    defaultValues?: Partial<FormData>;
    taskId?: string;
    onSuccess?: () => void;
}

export default function TaskForm({
    mode,
    defaultValues = {},
    taskId,
    onSuccess,
}: TaskFormProps) {
    const [assignableUsers, setAssignableUsers] = useState<AssignAbleUser[]>(
        []
    );
    const hasFetched = useRef(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, dirtyFields },
    } = useForm<FormData>({
        defaultValues: {
            title: defaultValues.title || "",
            description: defaultValues.description || "",
            deadline: defaultValues.deadline || "",
            priority: defaultValues.priority || Priority.LOW,
            assigneeId: defaultValues.assigneeId || "",
        },
    });

    useEffect(() => {
        const fetchUsers = async () => {
            if (!hasFetched.current) {
                try {
                    const res: ApiResponse = await apiClient.get(
                        "/task/assignable-users"
                    );
                    if (res.success) {
                        setAssignableUsers(res.data);
                        hasFetched.current = true;
                    } else {
                        console.error(res.message);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };
        
        fetchUsers();
    }, []);

    const onSubmit = async (data: FormData) => {
        try {
            const payload =
                mode === "update"
                    ? Object.fromEntries(
                          Object.entries(data).filter(
                              ([key]) => dirtyFields[key as keyof FormData]
                          )
                      )
                    : {
                          ...data,
                          deadline: new Date(data.deadline).toISOString(),
                      };

            if (mode === "update" && payload.deadline) {
                payload.deadline = new Date(payload.deadline).toISOString();
            }

            const response: ApiResponse =
                mode === "create"
                    ? await apiClient.post("/task", payload)
                    : await apiClient.patch(`/task/${taskId}`, payload);

            if (response.success) {
                alert(
                    `Task ${
                        mode === "create" ? "created" : "updated"
                    } successfully!`
                );
                onSuccess?.();
                router.push("/tasks");
            } else if (response.statusCode === 400 && response.data) {
                const errors = response.data;
                for (const key in errors) {
                    setError(key as keyof FormData, {
                        message: errors[key].msg,
                    });
                }
            } else {
                alert(`Error: ${response.message}`);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. Try again later.");
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {mode === "create" ? "Create Task" : "Update Task"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        {/* Assignee */}
                        <div className="space-y-2">
                            <Label>Select Assignee</Label>
                            <Select
                                defaultValue={defaultValues.assigneeId}
                                onValueChange={(value) =>
                                    setValue("assigneeId", value)
                                }
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

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                {...register("title", {
                                    required: "Title is required",
                                    minLength: {
                                        value: 3,
                                        message: "Minimum 3 chars",
                                    },
                                    maxLength: {
                                        value: 127,
                                        message: "Maximum 127 chars",
                                    },
                                })}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-500">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                {...register("description", {
                                    required: "Description is required",
                                    minLength: {
                                        value: 3,
                                        message: "Minimum 3 chars",
                                    },
                                    maxLength: {
                                        value: 255,
                                        message: "Maximum 255 chars",
                                    },
                                })}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* Deadline */}
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                type="date"
                                id="deadline"
                                {...register("deadline", {
                                    required: "Deadline is required",
                                    validate: (value) => {
                                        const today = new Date().setHours(
                                            0,
                                            0,
                                            0,
                                            0
                                        );
                                        const selected = new Date(
                                            value
                                        ).setHours(0, 0, 0, 0);
                                        return (
                                            selected >= today ||
                                            "Deadline must be in future"
                                        );
                                    },
                                })}
                            />
                            {errors.deadline && (
                                <p className="text-sm text-red-500">
                                    {errors.deadline.message}
                                </p>
                            )}
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label>Select Priority</Label>
                            <Select
                                defaultValue={
                                    defaultValues.priority || Priority.LOW
                                }
                                onValueChange={(value) =>
                                    setValue("priority", value as Priority)
                                }
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(Priority).map((p) => (
                                        <SelectItem key={p} value={p}>
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
                            {mode === "create" ? "Create Task" : "Update Task"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
