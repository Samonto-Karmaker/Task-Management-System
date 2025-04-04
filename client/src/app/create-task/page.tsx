"use client";

import TaskForm from "@/components/custom/TaskForm";
import Unauthorized from "@/components/custom/Unauthorized";
import { useUser } from "@/components/custom/hooks/useUser";
import { checkPermission } from "@/utils/checkPermission";

export default function CreateTask() {
    const { user } = useUser();
    const permission =
        checkPermission(user, "CREATE_TASK") &&
        checkPermission(user, "ASSIGN_TASK");
    if (!permission) {
        return <Unauthorized />;
    }

    return <TaskForm mode="create" />;
}
