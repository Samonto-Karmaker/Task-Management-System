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

export const getTasksWithOverdueDeadlinesByUserController = async (req, res) => {
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
}

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
}
