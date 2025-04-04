"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/components/custom/TaskForm";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { checkPermission } from "@/utils/checkPermission";
import { useUser } from "@/components/custom/hooks/useUser";
import Unauthorized from "@/components/custom/Unauthorized";

export default function EditTaskPage() {
    const [defaultValues, setDefaultValues] = useState({});
    const { id } = useParams();
    const { user } = useUser();
    const permission = checkPermission(user, "UPDATE_TASK");

    useEffect(() => {
        const taskData = localStorage.getItem("taskToUpdate");
        if (taskData) {
            const task = JSON.parse(taskData);
            setDefaultValues({
                title: task.title,
                description: task.description,
                deadline: task.deadline?.split("T")[0],
                priority: task.priority,
                assigneeId: task.assignee.id,
            });
        }
    }, []);

    if (!permission) {
        return <Unauthorized />;
    }

    if (!defaultValues || Object.keys(defaultValues).length === 0)
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
        );

    return (
        <TaskForm
            mode="update"
            taskId={id as string}
            defaultValues={defaultValues}
            onSuccess={() => {
                localStorage.removeItem("editTaskData");
            }}
        />
    );
}
