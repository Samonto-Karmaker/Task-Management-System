import {
    getAssignedTaskStatusStatsByUser,
    getCreatedTaskStatusStatsByUser,
    getTasksWithOverdueDeadlinesByUser,
    getTasksWithUpcomingDeadlinesByUser,
    workloadByUser,
} from "../service/analytics.service.js";
import ApiResponse from "../util/ApiResponse.js";
import { finalResErrorHandler } from "../util/finalResErrorHandler.js";

export const getAssignedTaskStatusStatsByUserController = async (req, res) => {
    let { userId } = req.params;
    if (!userId) {
        userId = req.user.id;
    }
    try {
        const statusStats = await getAssignedTaskStatusStatsByUser(userId);
        res.status(200).json(
            new ApiResponse(
                200,
                "Assigned task status stats retrieved",
                statusStats
            )
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getCreatedTaskStatusStatsByUserController = async (req, res) => {
    let { userId } = req.params;
    if (!userId) {
        userId = req.user.id;
    }
    try {
        const statusStats = await getCreatedTaskStatusStatsByUser(userId);
        res.status(200).json(
            new ApiResponse(
                200,
                "Created task status stats retrieved",
                statusStats
            )
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getTasksWithUpcomingDeadlinesByUserController = async (
    req,
    res
) => {
    let { userId } = req.params;
    let { days } = req.query;
    days = parseInt(days, 10) || 7;
    if (!userId) {
        userId = req.user.id;
    }
    try {
        const tasks = await getTasksWithUpcomingDeadlinesByUser(userId, days);
        res.status(200).json(
            new ApiResponse(
                200,
                "Tasks with upcoming deadlines retrieved",
                tasks
            )
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getTasksWithOverdueDeadlinesByUserController = async (
    req,
    res
) => {
    let { userId } = req.params;
    if (!userId) {
        userId = req.user.id;
    }
    try {
        const tasks = await getTasksWithOverdueDeadlinesByUser(userId);
        res.status(200).json(
            new ApiResponse(
                200,
                "Tasks with overdue deadlines retrieved",
                tasks
            )
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getWorkloadByUserController = async (req, res) => {
    let { userId } = req.params;
    if (!userId) {
        userId = req.user.id;
    }
    try {
        const workload = await workloadByUser(userId);
        res.status(200).json(
            new ApiResponse(200, "User workload retrieved", workload)
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getAllAnalyticsDataController = async (req, res) => {
    let { userId } = req.params;
    let { days } = req.query;

    if (!userId) {
        userId = req.user.id; // Use the logged-in user's ID if not provided
    }

    days = parseInt(days, 10) || 7; // Default to 7 days if not provided

    try {
        // Fetch all analytics data using Promise.allSettled
        const results = await Promise.allSettled([
            getAssignedTaskStatusStatsByUser(userId),
            getCreatedTaskStatusStatsByUser(userId),
            getTasksWithUpcomingDeadlinesByUser(userId, days),
            getTasksWithOverdueDeadlinesByUser(userId),
            workloadByUser(userId),
        ]);

        // Map the results to a structured response
        const analyticsData = {
            assignedTaskStats:
                results[0].status === "fulfilled"
                    ? results[0].value
                    : { error: results[0].reason.message },
            createdTaskStats:
                results[1].status === "fulfilled"
                    ? results[1].value
                    : { error: results[1].reason.message },
            upcomingDeadlines:
                results[2].status === "fulfilled"
                    ? results[2].value
                    : { error: results[2].reason.message },
            overdueDeadlines:
                results[3].status === "fulfilled"
                    ? results[3].value
                    : { error: results[3].reason.message },
            workload:
                results[4].status === "fulfilled"
                    ? results[4].value
                    : { error: results[4].reason.message },
        };

        res.status(200).json(
            new ApiResponse(
                200,
                "All analytics data retrieved successfully",
                analyticsData
            )
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};
