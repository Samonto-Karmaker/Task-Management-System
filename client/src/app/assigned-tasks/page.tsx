"use client";

import EmptyTable from "@/components/custom/EmptyTable";
import { useEffect, useState } from "react";
import { useUser } from "@/components/custom/hooks/useUser";
import Loading from "@/components/custom/Loading";
import { Task } from "@/types/task";
import { ApiResponse } from "@/types/api-response";
import apiClient from "@/lib/apiClient";
import UserTasksDashboardPage from "@/components/custom/UserTasksDashboard";
import { checkPermission } from "@/utils/checkPermission";
import Unauthorized from "@/components/custom/Unauthorized";

export default function AssignedTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useUser();
    const canViewAssignedTasks = checkPermission(user, "VIEW_ASSIGNED_TASK");

    useEffect(() => {
        const fetchAssignedTasks = async () => {
            try {
                const response: ApiResponse = await apiClient.get(
                    "/task/assignee"
                );
                if (response.success) {
                    const tasksData = response.data as Task[];
                    setTasks(
                        tasksData.map((task) => {
                            return {
                                ...task,
                                assignee: {
                                    id: user ? user.id : "",
                                    name: user ? user.name : "",
                                },
                            };
                        })
                    );
                } else {
                    console.error(response.message);
                    alert(`Failed to fetch tasks: ${response.message}`);
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (canViewAssignedTasks) {
            fetchAssignedTasks();
        }
    }, [user, canViewAssignedTasks]);

    if (loading) {
        return <Loading />;
    }
    if (tasks.length === 0) {
        return <EmptyTable />;
    }
    if (!canViewAssignedTasks) {
        return <Unauthorized />
    }

    return (
        <UserTasksDashboardPage
            tasks={tasks}
            setTasks={setTasks}
            isAssigneeView={true}
        />
    );
}
