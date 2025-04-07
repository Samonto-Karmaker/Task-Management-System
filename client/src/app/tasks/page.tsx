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
import Link from "next/link";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import UpdateTaskStatusSelect from "@/components/custom/UpdateTaskStatusSelect";
import UpdateTaskButton from "@/components/custom/UpdateTaskButton";
import { TaskStatus } from "@/utils/constant";
import { useRouter } from "next/navigation";

interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    deadline: string;
    status: string;
    assigner: {
        id: string;
        name: string;
    };
    assignee: {
        id: string;
        name: string;
    };
}

export default function AllTasksDashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { user } = useUser();
    const router = useRouter();

    const isAuthorized = checkPermission(user, "VIEW_TASKS");
    const canChangeStatus = checkPermission(user, "UPDATE_TASK_STATUS");
    const canUpdateTask = checkPermission(user, "UPDATE_TASK");
    const canDeleteTask = checkPermission(user, "DELETE_TASK");
    const canCreateTask = checkPermission(user, "CREATE_TASK");
    const canViewAssignedTasks = checkPermission(user, "VIEW_ASSIGNED_TASK");
    const canViewCreatedTasks = checkPermission(user, "VIEW_TASK_ASSIGNEES");

    useEffect(() => {
        const fetchAllTasks = async () => {
            try {
                const response: ApiResponse = await apiClient.get("/task");
                if (response.success) {
                    console.log(response.data);
                    setTasks(response.data);
                } else {
                    console.error(response.message);
                    alert(`Failed to fetch tasks: ${response.message}`);
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred. Please try again later.");
            }
        };

        if (isAuthorized) {
            fetchAllTasks();
        }
    }, [isAuthorized]);

    useEffect(() => {
        if (!isAuthorized && user) {
            if (canViewAssignedTasks) {
                router.push("/assigned-tasks");
                return;
            } else if (canViewCreatedTasks) {
                router.push("/created-tasks");
                return;
            }
        }
    }, [user, canViewAssignedTasks, canViewCreatedTasks, router, isAuthorized]);

    const handleDeleteTask = async (taskId: string) => {
        if (confirm("Are you sure you want to delete this task?")) {
            try {
                const response: ApiResponse = await apiClient.delete(
                    `/task/${taskId}`
                );
                if (response.success) {
                    setTasks((prevTasks) =>
                        prevTasks.filter((task) => task.id !== taskId)
                    );
                } else {
                    console.error(response.message);
                    alert(`Failed to delete task: ${response.message}`);
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred. Please try again later.");
            }
        }
    };

    if (!isAuthorized) {
        return <Unauthorized />;
    }
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">All Tasks Dashboard</h1>
            <div className="flex justify-between mb-4">
                <div className="flex items-center space-x-4">
                    {canCreateTask && (
                        <Link href="/create-task">
                            <Button className="cursor-pointer">
                                Create Task
                            </Button>
                        </Link>
                    )}
                    {canViewAssignedTasks && (
                        <Link href="/assigned-tasks">
                            <Button
                                variant="secondary"
                                className="cursor-pointer"
                            >
                                Assigned Tasks
                            </Button>
                        </Link>
                    )}
                    {canViewCreatedTasks && (
                        <Link href="/created-tasks">
                            <Button variant="secondary">Created Tasks</Button>
                        </Link>
                    )}
                </div>
            </div>
            <hr className="my-8" />
            <div className="overflow-x-auto">
                <Table className="min-w-full border border-gray-200 rounded-md">
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="text-left p-3">
                                Title
                            </TableHead>
                            <TableHead className="text-left p-3">
                                Priority
                            </TableHead>
                            <TableHead className="text-left p-3">
                                Deadline
                            </TableHead>
                            <TableHead className="text-left p-3">
                                Status
                            </TableHead>
                            <TableHead className="text-left p-3">
                                Assigner
                            </TableHead>
                            <TableHead className="text-left p-3">
                                Assignee
                            </TableHead>
                            {canUpdateTask && (
                                <TableHead className="text-left p-3">
                                    Update
                                </TableHead>
                            )}
                            {canDeleteTask && (
                                <TableHead className="text-left p-3">
                                    Delete
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id} className="border-b">
                                <TableCell className="p-3">
                                    {task.title}
                                </TableCell>
                                <TableCell className="p-3">
                                    {task.priority}
                                </TableCell>
                                <TableCell
                                    className={`p-3 ${
                                        new Date(task.deadline).setHours(
                                            0,
                                            0,
                                            0,
                                            0
                                        ) < new Date().setHours(0, 0, 0, 0)
                                            ? "text-red-500 font-bold"
                                            : ""
                                    }`}
                                >
                                    {task.deadline.split("T")[0]}
                                </TableCell>
                                <TableCell className="p-3">
                                    <UpdateTaskStatusSelect
                                        taskId={task.id}
                                        currentStatus={
                                            task.status as TaskStatus
                                        }
                                        onStatusChange={(status) =>
                                            setTasks((prev) =>
                                                prev.map((t) =>
                                                    t.id === task.id
                                                        ? { ...t, status }
                                                        : t
                                                )
                                            )
                                        }
                                        canChangeStatus={canChangeStatus}
                                        userId={user?.id || ""}
                                        assigneeId={task.assignee.id}
                                        assignerId={task.assigner.id}
                                    />
                                </TableCell>
                                <TableCell className="p-3">
                                    {task.assigner.name}
                                </TableCell>
                                <TableCell className="p-3">
                                    {task.assignee.name}
                                </TableCell>
                                {canUpdateTask && (
                                    <TableCell className="p-3">
                                        <UpdateTaskButton task={task} />
                                    </TableCell>
                                )}
                                {canDeleteTask && (
                                    <TableCell className="p-3">
                                        <Button
                                            variant="ghost"
                                            className="text-red-500"
                                            onClick={() =>
                                                handleDeleteTask(task.id)
                                            }
                                        >
                                            <Trash2 size={20} />
                                        </Button>
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
