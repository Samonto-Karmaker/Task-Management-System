import {
    createTask,
    getAllTasks,
    getTaskById,
    getTasksByAssignee,
    getTasksByAssigner,
} from "../service/task.service.js";
import ApiResponse from "../util/ApiResponse.js";
import { finalResErrorHandler } from "../util/finalResErrorHandler.js";

export const createTaskController = async (req, res) => {
    const { name, description, priority, deadline, assigneeId } = req.body;
    const assignerId = req.user.id;
    try {
        const newTask = await createTask({
            name,
            description,
            priority,
            deadline,
            assignerId,
            assigneeId,
        });

        res.status(201).json(new ApiResponse(201, "Task created", newTask));
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getAllTasksController = async (req, res) => {
    try {
        const tasks = await getAllTasks();
        res.status(200).json(
            new ApiResponse(200, "Tasks fetched successfully", tasks)
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getTaskByIdController = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await getTaskById(id);
        res.status(200).json(
            new ApiResponse(200, "Task fetched successfully", task)
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getTaskByAssignerController = async (req, res) => {
    const userId = req.user.id;
    try {
        const tasks = await getTasksByAssigner(userId);
        res.status(200).json(
            new ApiResponse(200, "Task fetched successfully", tasks)
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getTaskByAssigneeController = async (req, res) => {
    const userId = req.user.id;
    try {
        const tasks = await getTasksByAssignee(userId);
        res.status(200).json(
            new ApiResponse(200, "Task fetched successfully", tasks)
        );
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};
