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
            },
        });

        const normalizedStats = statusStats.reduce((acc, item) => {
            acc[item.status] = item._count.status;
            return acc;
        }, {});

        return normalizedStats;
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
            },
        });

        const normalizedStats = statusStats.reduce((acc, item) => {
            acc[item.status] = item._count.status;
            return acc;
        }, {});

        return normalizedStats;
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
        const { startDate, endDate } = getDateRange(days);

        const upcomingTasks = await prisma.task.findMany({
            where: {
                OR: [{ assigneeId: userId }, { assignerId: userId }],
                NOT: {
                    status: TaskStatus.COMPLETED,
                },
                deadline: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                id: true,
                title: true,
                deadline: true,
            },
            orderBy: {
                deadline: "asc",
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
        const { startDate, _ } = getDateRange(0); // Get current date in UTC, at 00:00
        const overdueTasks = await prisma.task.findMany({
            where: {
                OR: [{ assigneeId: userId }, { assignerId: userId }],
                NOT: {
                    status: TaskStatus.COMPLETED,
                },
                deadline: {
                    lt: startDate,
                },
            },
            select: {
                id: true,
                title: true,
                deadline: true,
            },
            orderBy: {
                deadline: "asc",
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
    const { startDate, endDate } = getDateRange(7);
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
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                }),
                prisma.task.count({
                    where: {
                        OR: [{ assigneeId: userId }, { assignerId: userId }],
                        NOT: {
                            status: TaskStatus.COMPLETED,
                        },
                        deadline: { lt: startDate },
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

// Helper function
const getDateRange = (days) => {
    // Get current date in UTC, at 00:00
    const now = new Date();
    const startDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    // Get end date in UTC (days from now at 23:59:59.999)
    const endDate = new Date(
        startDate.getTime() + days * 24 * 60 * 60 * 1000 - 1
    );

    return { startDate, endDate };
};
