"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TaskStatus } from "@/utils/constant";
import { ApiResponse } from "@/types/api-response";
import apiClient from "@/lib/apiClient";
import { useState } from "react";

interface Props {
    taskId: string;
    currentStatus: TaskStatus;
    onStatusChange: (status: TaskStatus) => void;
    canChangeStatus: boolean;
    userId: string;
    assigneeId?: string;
    assignerId?: string;
}

export default function UpdateTaskStatusSelect({
    taskId,
    currentStatus,
    onStatusChange,
    canChangeStatus,
    userId,
    assigneeId,
    assignerId,
}: Props) {
    const [loading, setLoading] = useState(false);

    const isEditable =
        canChangeStatus &&
        currentStatus !== TaskStatus.COMPLETED &&
        (userId === assigneeId || userId === assignerId);

    const handleChange = async (status: TaskStatus) => {
        if (!confirm("Are you sure you want to update this task status?"))
            return;
        try {
            setLoading(true);
            const response: ApiResponse = await apiClient.patch(
                `/task/update-status/${taskId}`,
                { status }
            );
            if (response.success) {
                onStatusChange(status);
            } else {
                alert(`Failed to update status: ${response.message}`);
            }
        } catch (err) {
            alert("Something went wrong.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isEditable) {
        return (
            <span
                className={
                    currentStatus === TaskStatus.COMPLETED
                        ? "text-green-500 font-bold"
                        : currentStatus === TaskStatus.IN_PROGRESS
                        ? "text-yellow-500 font-bold"
                        : "text-red-500 font-bold"
                }
            >
                {currentStatus}
            </span>
        );
    }

    return (
        <Select
            defaultValue={currentStatus}
            onValueChange={(value) => handleChange(value as TaskStatus)}
            disabled={loading}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
                {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                        {status}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
