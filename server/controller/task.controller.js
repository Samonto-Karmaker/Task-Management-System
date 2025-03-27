import { createTask } from "../service/task.service.js";
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
        })

        res.status(201).json(new ApiResponse(201, "Task created", newTask));
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};