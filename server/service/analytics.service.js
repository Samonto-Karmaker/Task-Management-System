import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";
import { TaskStatus } from "@prisma/client";

export const getAssignedTaskStatusStatsByUser = async (userId) => {
    if (!userId) {
        throw new ApiError("User ID is required", 400);
    }
    try {
        const statusStats = await prisma.task.groupBy({
            by: ["status"],
            where: {
                assigneeId: userId,
            },
            _count: {
                status: true,
            }
        });

        return statusStats;
    } catch (error) {
        console.error("Error fetching assigned task status stats:", error);
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getCreatedTaskStatusStatsByUser = async (userId) => {
    if (!userId) {
        throw new ApiError("User ID is required", 400);
    }
    try {
        const statusStats = await prisma.task.groupBy({
            by: ["status"],
            where: {
                assignerId: userId,
            },
            _count: {
                status: true,
            }
        });

        return statusStats;
    } catch (error) {
        console.error("Error fetching created task status stats:", error);
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getTasksWithUpcomingDeadlinesByUser = async (userId, days) => {
    if (!userId || !days) {
        throw new ApiError("User ID and days are required", 400);
    }
    if (typeof days !== "number") {
        throw new ApiError("Days must be a number", 400);
    }
    if (days <= 0) {
        throw new ApiError("Days must be a positive number", 400);
    }
    try {
        const upcomingTasks = await prisma.task.findMany({
            where: {
                OR: [{ assigneeId: userId }, { assignerId: userId }],
                NOT: {
                    status: TaskStatus.COMPLETED,
                },
                deadline: {
                    gte: new Date(),
                    lte: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
                },
            },
            select: {
                id: true,
                title: true,
                deadline: true,
            },
        });

        return upcomingTasks;
    } catch (error) {
        console.error("Error fetching tasks with upcoming deadlines:", error);
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getTasksWithOverdueDeadlinesByUser = async (userId) => {
    if (!userId) {
        throw new ApiError("User ID is required", 400);
    }
    try {
        const overdueTasks = await prisma.task.findMany({
            where: {
                OR: [{ assigneeId: userId }, { assignerId: userId }],
                NOT: {
                    status: TaskStatus.COMPLETED,
                },
                deadline: {
                    lt: new Date(),
                },
            },
            select: {
                id: true,
                title: true,
                deadline: true,
            },
        });

        return overdueTasks;
    } catch (error) {
        console.error("Error fetching tasks with overdue deadlines:", error);
        throw new ApiError(500, "Internal Server Error");
    }
};

export const workloadByUser = async (userId) => {
    if (!userId) {
        throw new ApiError("User ID is required", 400);
    }
    try {
        const [taskInHand, taskManaging, tasksWithUpcoming, tasksWithOverdue] =
            await Promise.all([
                prisma.task.count({
                    where: {
                        assigneeId: userId,
                        NOT: {
                            status: TaskStatus.COMPLETED,
                        },
                    },
                }),
                prisma.task.count({
                    where: {
                        assignerId: userId,
                        NOT: {
                            status: TaskStatus.COMPLETED,
                        },
                    },
                }),
                prisma.task.count({
                    where: {
                        OR: [{ assigneeId: userId }, { assignerId: userId }],
                        NOT: {
                            status: TaskStatus.COMPLETED,
                        },
                        deadline: {
                            gte: new Date(),
                            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        },
                    },
                }),
                prisma.task.count({
                    where: {
                        OR: [{ assigneeId: userId }, { assignerId: userId }],
                        NOT: {
                            status: TaskStatus.COMPLETED,
                        },
                        deadline: { lt: new Date() },
                    },
                }),
            ]);

        return {
            taskInHand,
            taskManaging,
            tasksWithUpcoming,
            tasksWithOverdue,
        };
    } catch (error) {
        console.error("Error fetching workload by user:", error);
        throw new ApiError(500, "Internal Server Error");
    }
};
