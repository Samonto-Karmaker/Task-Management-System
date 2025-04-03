import { Router } from "express";
import {
    checkAuth,
    checkRole,
} from "../middleware/common/authorization.middleware.js";
import { UserPermissions } from "../util/constant.js";
import {
    createTaskValidator,
    createTaskValidatorMiddleware,
} from "../middleware/task/createTaskValidator.middleware.js";
import {
    createTaskController,
    getAllTasksController,
    getTaskByAssigneeController,
    getTaskByAssignerController,
    getTaskByIdController,
} from "../controller/task.controller.js";

const taskRouter = Router();

taskRouter.post(
    "/",
    checkAuth,
    checkRole(UserPermissions.CREATE_TASK),
    createTaskValidator,
    createTaskValidatorMiddleware,
    createTaskController
);

taskRouter.get(
    "/",
    checkAuth,
    checkRole(UserPermissions.VIEW_TASKS),
    getAllTasksController
);

taskRouter.get(
    "/assigner",
    checkAuth,
    checkRole(UserPermissions.VIEW_TASK_ASSIGNEES),
    getTaskByAssignerController
);

taskRouter.get(
    "/assignee",
    checkAuth,
    checkRole(UserPermissions.VIEW_ASSIGNED_TASK),
    getTaskByAssigneeController
);

taskRouter.get(
    "/:id",
    checkAuth,
    checkRole(UserPermissions.VIEW_TASK),
    getTaskByIdController
);

export default taskRouter;
