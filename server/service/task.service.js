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
export const getTaskById = async (id) => {};
export const updateTaskDetails = async (id, task) => {};
export const deleteTask = async (id) => {};
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
            }
        })

        return tasks;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Failed to fetch tasks");
    }
};
export const getTasksByAssigner = async (userId) => {};
export const getTasksByAssignee = async (userId) => {};
export const updateTaskStatus = async (id, status) => {};
