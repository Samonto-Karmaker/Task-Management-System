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
import { FilePenLine, Trash2 } from "lucide-react";
import UserTasksDashboardPage from "@/components/custom/UserTasksDashboard";

interface Task {
    id: string;
    title: string;
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
    const isAuthorized = checkPermission(user, "VIEW_TASKS");

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
        if (user) {
            return <UserTasksDashboardPage />;
        }
        return <Unauthorized />;
    }
    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">All Tasks Dashboard</h1>
            <Link href="/create-task">
                <Button>Create Task</Button>
            </Link>
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
                            <TableHead className="text-left p-3">
                                Edit
                            </TableHead>
                            <TableHead className="text-left p-3">
                                Delete
                            </TableHead>
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
                                    {task.status}
                                </TableCell>
                                <TableCell className="p-3">
                                    {task.assigner.name}
                                </TableCell>
                                <TableCell className="p-3">
                                    {task.assignee.name}
                                </TableCell>
                                <TableCell className="p-3">
                                    <Button
                                        variant="default"
                                        className="cursor-pointer"
                                    >
                                        <FilePenLine />
                                    </Button>
                                </TableCell>
                                <TableCell className="p-3">
                                    <Button
                                        variant="destructive"
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleDeleteTask(task.id)
                                        }
                                    >
                                        <Trash2 />
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
