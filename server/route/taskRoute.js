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
import { createTaskController } from "../controller/task.controller.js";

const taskRouter = Router();

taskRouter.post(
    "/",
    checkAuth,
    checkRole(UserPermissions.CREATE_TASK),
    createTaskValidator,
    createTaskValidatorMiddleware,
    createTaskController
);

export default taskRouter;
