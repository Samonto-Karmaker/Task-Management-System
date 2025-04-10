"use client";

import { useUser } from "@/components/custom/hooks/useUser";
import { checkPermission } from "@/utils/checkPermission";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import UpdateTaskButton from "./UpdateTaskButton";
import DeleteTaskButton from "./DeleteTaskButton";
import UpdateTaskStatusSelect from "./UpdateTaskStatusSelect";
import { TaskStatus, UserPermissions } from "@/utils/constant";
import { Task } from "@/types/task";
import Link from "next/link";

interface UserTasksDashboardProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    isAssigneeView?: boolean;
}

export default function UserTasksDashboardPage({
    tasks,
    setTasks,
    isAssigneeView = true,
}: UserTasksDashboardProps) {
    const { user } = useUser();
    const canChangeStatus = checkPermission(
        user,
        UserPermissions.UPDATE_TASK_STATUS
    );
    const canUpdateTask = checkPermission(user, UserPermissions.UPDATE_TASK);
    const canDeleteTask = checkPermission(user, UserPermissions.DELETE_TASK);
    const canViewUser = checkPermission(user, UserPermissions.VIEW_USER);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">User Tasks</h1>
            <p className="text-sm text-muted-foreground">
                This is the user tasks dashboard page.
            </p>
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
                            {isAssigneeView ? (
                                <TableHead className="text-left p-3">
                                    Assigner
                                </TableHead>
                            ) : (
                                <TableHead className="text-left p-3">
                                    Assignee
                                </TableHead>
                            )}
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
                                    <Link
                                        href={`/task-details/${task.id}`}
                                        className="font-bold text-blue-500 hover:text-blue-800"
                                    >
                                        {task.title}
                                    </Link>
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
                                        assigneeId={task.assignee?.id}
                                        assignerId={task.assigner?.id}
                                    />
                                </TableCell>
                                <TableCell className="p-3">
                                    {canViewUser ? (
                                        <Link
                                            href={`/users/${
                                                isAssigneeView
                                                    ? task.assigner?.id
                                                    : task.assignee?.id
                                            }`}
                                            className="font-bold text-blue-500 hover:text-blue-800"
                                        >
                                            {isAssigneeView
                                                ? task.assigner?.name || "N/A"
                                                : task.assignee?.name || "N/A"}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-500">
                                            {isAssigneeView
                                                ? task.assignee?.name || "N/A"
                                                : task.assigner?.name || "N/A"}
                                        </span>
                                    )}
                                </TableCell>
                                {canUpdateTask && (
                                    <TableCell className="p-3">
                                        <UpdateTaskButton task={task} />
                                    </TableCell>
                                )}
                                {canDeleteTask && (
                                    <TableCell className="p-3">
                                        <DeleteTaskButton
                                            taskId={task.id}
                                            onDelete={() =>
                                                setTasks((prevTasks) =>
                                                    prevTasks.filter(
                                                        (t) => t.id !== task.id
                                                    )
                                                )
                                            }
                                        />
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
