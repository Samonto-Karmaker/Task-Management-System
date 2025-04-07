"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types/api-response";
import { useState } from "react";

interface Props {
    taskId: string;
    onDelete: () => void;
}

export default function DeleteTaskButton({ taskId, onDelete }: Props) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!confirm("Are you sure you want to delete this task?")) return;

        try {
            setLoading(true);
            const response: ApiResponse = await apiClient.delete(`/task/${taskId}`);
            if (response.success) {
                onDelete();
            } else {
                alert(`Failed to delete task: ${response.message}`);
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting the task.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button variant="ghost" className="text-red-500" onClick={handleClick} disabled={loading}>
            <Trash2 size={20} />
        </Button>
    );
}
