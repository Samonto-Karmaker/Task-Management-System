import { prisma } from "../db/setupDB.js";
import ApiError from "../util/ApiError.js";
import { TaskStatus } from "@prisma/client";

export const createTask = async ({
    name,
    description,
    priority,
    deadline,
    assignerId,
    assigneeId,
}) => {
    if (
        !name ||
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
                title: name,
                description,
                priority,
                deadline,
                assignerId,
                assigneeId,
            },
        });

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
export const updateTaskDetails = async (id, task) => {};
export const deleteTask = async (id) => {};
export const getAllTasks = async () => {
    try {
        const tasks = await prisma.task.findMany({
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
                status: true,
            },
        });
        if (!updatedTask) {
            throw new ApiError(404, "Task not found");
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
