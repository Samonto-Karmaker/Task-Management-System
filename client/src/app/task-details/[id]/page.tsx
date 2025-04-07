"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ApiResponse } from "@/types/api-response";
import UpdateTaskButton from "@/components/custom/UpdateTaskButton";
import DeleteTaskButton from "@/components/custom/DeleteTaskButton";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/custom/hooks/useUser";
import { checkPermission } from "@/utils/checkPermission";
import Loading from "@/components/custom/Loading";
import Unauthorized from "@/components/custom/Unauthorized";

interface Role {
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    deadline: string;
    status: string;
    updatedAt: string;
    createdAt: string;
    assigner: User;
    assignee: User;
}

export default function TaskDetailsPage() {
    const [task, setTask] = useState<Task | null>(null);
    const { id } = useParams();

    const router = useRouter();
    const { user } = useUser();

    const canViewTask = checkPermission(user, "VIEW_TASK");
    const canUpdateTask = checkPermission(user, "UPDATE_TASK");
    const canDeleteTask = checkPermission(user, "DELETE_TASK");

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response: ApiResponse = await apiClient.get(
                    `/task/${id}`
                );
                if (response.success) {
                    setTask(response.data);
                } else {
                    alert(`Failed to fetch task: ${response.message}`);
                }
            } catch (err) {
                console.error(err);
                alert("An error occurred while fetching task.");
            }
        };

        if (id && canViewTask) fetchTask();
    }, [id, canViewTask]);

    if (!canViewTask) return <Unauthorized />;
    if (!task) return <Loading />;

    return (
        <main className="container mx-auto max-w-4xl py-10 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{task.title}</CardTitle>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-muted-foreground">
                            Created on:{" "}
                            {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex items-center space-x-2">
                            {canUpdateTask && <UpdateTaskButton task={task} />}
                            {canDeleteTask && (
                                <DeleteTaskButton
                                    taskId={task.id}
                                    onDelete={() => {
                                        setTask(null);
                                        alert("Task deleted successfully.");
                                        router.push("/tasks");
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-6 mt-4">
                    {/* Description */}
                    <div>
                        <h2 className="font-semibold text-lg">Description</h2>
                        <p className="text-gray-700 mt-1">{task.description}</p>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Priority
                            </p>
                            <Badge
                                variant="outline"
                                className={`${
                                    task.priority === "HIGH"
                                        ? "border-red-500 text-red-500"
                                        : task.priority === "MEDIUM"
                                        ? "border-yellow-500 text-yellow-500"
                                        : "border-green-500 text-green-500"
                                }`}
                            >
                                {task.priority}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Status
                            </p>
                            <Badge
                                className={`${
                                    task.status === "COMPLETED"
                                        ? "bg-green-500"
                                        : task.status === "IN_PROGRESS"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                }`}
                            >
                                {task.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Deadline
                            </p>
                            <p className="text-gray-800">
                                {new Date(task.deadline).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Last Updated
                            </p>
                            <p className="text-gray-800">
                                {new Date(task.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Assigner Info */}
                    <div>
                        <h2 className="font-semibold text-lg">Assigner</h2>
                        <div className="text-gray-700 mt-1 space-y-1">
                            <p>
                                <span className="font-medium">Name:</span>{" "}
                                {task.assigner.name}
                            </p>
                            <p>
                                <span className="font-medium">Email:</span>{" "}
                                {task.assigner.email}
                            </p>
                            <p>
                                <span className="font-medium">Role:</span>{" "}
                                <Badge variant="outline">
                                    {task.assigner.role.name}
                                </Badge>
                            </p>
                        </div>
                    </div>

                    {/* Assignee Info */}
                    <div>
                        <h2 className="font-semibold text-lg">Assignee</h2>
                        <div className="text-gray-700 mt-1 space-y-1">
                            <p>
                                <span className="font-medium">Name:</span>{" "}
                                {task.assignee.name}
                            </p>
                            <p>
                                <span className="font-medium">Email:</span>{" "}
                                {task.assignee.email}
                            </p>
                            <p>
                                <span className="font-medium">Role:</span>{" "}
                                <Badge variant="outline">
                                    {task.assignee.role.name}
                                </Badge>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
