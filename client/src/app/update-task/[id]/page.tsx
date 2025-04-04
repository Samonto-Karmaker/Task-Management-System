"use client";

import { useEffect, useState } from "react";
import TaskForm from "@/components/custom/TaskForm";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function EditTaskPage() {
    const [defaultValues, setDefaultValues] = useState({});
    const { id } = useParams();

    useEffect(() => {
        const taskData = localStorage.getItem("taskToUpdate");
        if (taskData) {
            const task = JSON.parse(taskData);
            setDefaultValues({
                title: task.title,
                description: task.description,
                deadline: task.deadline?.substring(0, 10),
                priority: task.priority,
                assigneeId: task.assignee.id,
            });
        }
    }, []);

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
