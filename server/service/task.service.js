import { prisma } from "../db/setupDB.js";
import ApiError from "../util/ApiError.js";
import { TaskStatus } from "@prisma/client";
import { getUsersWithPermission } from "./user.service.js";
import { UserPermissions } from "../util/constant.js";
import {
    createInAppNotification,
    dispatchNotification,
    sendInAppNotification,
} from "./notification.service.js";
import inAppNotificationTemplate from "../util/template/inAppNotificationTemplate.js";

export const createTask = async ({
    title,
    description,
    priority,
    deadline,
    assignerId,
    assignerName,
    assigneeId,
}) => {
    if (
        !title ||
        !description ||
        !priority ||
        !deadline ||
        !assignerId ||
        !assigneeId
    ) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                deadline,
                assignerId,
                assigneeId,
            },
        });

        const notificationData = inAppNotificationTemplate.TASK_ASSIGNED(
            newTask.title,
            newTask.id,
            assignerName
        );
        const notificationId = await createInAppNotification(
            notificationData,
            assigneeId
        );
        if (notificationId) {
            await dispatchNotification(notificationId);
        }

        return newTask;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to create task");
    }
};
export const getTaskById = async (id) => {
    if (!id) {
        throw new ApiError(400, "Task ID is required");
    }
    try {
        const task = await prisma.task.findUnique({
            where: { id },
            select: {
                id: true,
                title: true,
                description: true,
                priority: true,
                deadline: true,
                status: true,
                updatedAt: true,
                createdAt: true,
                assigner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        return task;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to fetch task by ID");
    }
};
export const updateTaskDetails = async (taskId, userId, updatedTask) => {
    if (
        !taskId ||
        !userId ||
        !updatedTask ||
        Object.keys(updatedTask).length === 0
    ) {
        throw new ApiError(
            400,
            "Task ID, User ID, and updated task are required"
        );
    }
    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                assignerId: true,
            },
        });
        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        const isAssigner = task.assignerId === userId;
        if (!isAssigner) {
            throw new ApiError(
                403,
                "You do not have permission to update this task"
            );
        }

        const updatedTaskDetails = await prisma.task.update({
            where: { id: taskId },
            data: updatedTask,
            select: {
                id: true,
                title: true,
                description: true,
                priority: true,
                deadline: true,
                updatedAt: true,
                assigner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!updatedTaskDetails) {
            throw new ApiError(404, "Task not found");
        }

        return updatedTaskDetails;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to update task details");
    }
};
export const deleteTask = async (taskId, userId) => {
    if (!taskId || !userId) {
        throw new ApiError(400, "Task ID and User ID are required");
    }
    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                assignerId: true,
            },
        });
        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        const isAssigner = task.assignerId === userId;
        if (!isAssigner) {
            throw new ApiError(
                403,
                "You do not have permission to delete this task"
            );
        }

        await prisma.task.delete({
            where: { id: taskId },
        });

        return { message: "Task deleted successfully" };
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to delete task");
    }
};
export const getAllTasks = async () => {
    try {
        const tasks = await prisma.task.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                priority: true,
                deadline: true,
                status: true,
                assigner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return tasks;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to fetch tasks");
    }
};
export const getTasksByAssigner = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    try {
        const tasks = await prisma.task.findMany({
            where: { assignerId: userId },
            select: {
                id: true,
                title: true,
                priority: true,
                deadline: true,
                status: true,
                assignee: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return tasks;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to fetch tasks by assigner ID");
    }
};
export const getTasksByAssignee = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    try {
        const tasks = await prisma.task.findMany({
            where: { assigneeId: userId },
            select: {
                id: true,
                title: true,
                priority: true,
                deadline: true,
                status: true,
                assigner: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return tasks;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to fetch tasks by assignee ID");
    }
};
export const updateTaskStatus = async (taskId, userId, status) => {
    if (!taskId || !userId || !status) {
        throw new ApiError(400, "Task ID, User ID, and status are required");
    }
    if (!Object.values(TaskStatus).includes(status)) {
        throw new ApiError(400, "Invalid task status");
    }
    try {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                status: true,
                assignerId: true,
                assigneeId: true,
            },
        });

        if (!task) {
            throw new ApiError(404, "Task not found");
        }

        isValidTaskStatusTransition(task.status, status);
        isUpdaterAuthorized(task, userId);

        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                status: status,
            },
            select: {
                id: true,
                title: true,
                status: true,
            },
        });
        if (!updatedTask) {
            throw new ApiError(404, "Task not found");
        }

        const notificationData = inAppNotificationTemplate.TASK_STATUS_UPDATED(
            updatedTask.title,
            updatedTask.id,
            updatedTask.status
        )
        
        const notificationIdAssignee = await createInAppNotification(
            notificationData,
            task.assigneeId
        );
        if (notificationIdAssignee) {
            await dispatchNotification(notificationIdAssignee);
        }

        const notificationIdAssigner = await createInAppNotification(
            notificationData,
            task.assignerId
        );
        if (notificationIdAssigner) {
            await dispatchNotification(notificationIdAssigner);
        }

        return updatedTask;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to update task status");
    }
};
export const getAssignableUsers = async () => {
    try {
        const users = await getUsersWithPermission(
            UserPermissions.UPDATE_TASK_STATUS
        );
        if (!users) {
            throw new ApiError(
                404,
                "No users found with the specified permission"
            );
        }
        return users.map((user) => {
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role.name,
            };
        });
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Failed to fetch assignable users");
    }
};

// Helper functions
const isValidTaskStatusTransition = (currentStatus, newStatus) => {
    if (currentStatus === newStatus) {
        throw new ApiError(400, "Task is already in the requested status");
    }
    if (currentStatus === TaskStatus.COMPLETED) {
        throw new ApiError(400, "Cannot update a completed task");
    }
    if (
        currentStatus === TaskStatus.IN_PROGRESS &&
        newStatus === TaskStatus.PENDING
    ) {
        throw new ApiError(
            400,
            "Cannot move task back to pending from in progress"
        );
    }
};
const isUpdaterAuthorized = (task, userId) => {
    const isAssigner = task.assignerId === userId;
    const isAssignee = task.assigneeId === userId;
    if (!isAssigner && !isAssignee) {
        throw new ApiError(
            403,
            "You do not have permission to update this task"
        );
    }
};
