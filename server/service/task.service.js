import { prisma } from "../db/setupDB.js";
import ApiError from "../util/ApiError.js";

export const createTask = async ({
    name,
    description,
    priority,
    deadline,
    assignerId,
    assigneeId,
}) => {
    if (!name || !description || !priority || !deadline || !assignerId || !assigneeId) {
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
            }
        })

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
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        }
                    },
                },
                assignee: {
                    select: {
                        id: true,
                        name: true,
                        role: {
                            select: {
                                id: true,
                                name: true,
                            },
                        }
                    },
                },
            }
        })

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
            }
        })

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
            where: {assignerId: userId},
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
            }
        })

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
            where: {assigneeId: userId},
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
            }
        })

        return tasks;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to fetch tasks by assignee ID");
    }
};
export const updateTaskStatus = async (id, status) => {};
