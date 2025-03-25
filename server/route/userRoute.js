import { Router } from "express";
import {
    createUserValidationResult,
    createUserValidator,
} from "../middleware/user/createUserValidator.middleware.js";
import {
    createUserController,
    getAllUsersController,
    getLoggedInUserController,
    loginController,
    logoutController,
} from "../controller/user.controller.js";
import {
    checkAuth,
    checkRole,
} from "../middleware/common/authorization.middleware.js";
import { UserPermissions } from "../util/constant.js";

const userRouter = Router();

userRouter.post(
    "/",
    checkAuth,
    checkRole(UserPermissions.CREATE_USER),
    createUserValidator,
    createUserValidationResult,
    createUserController
);
userRouter.get(
    "/",
    checkAuth,
    checkRole(UserPermissions.VIEW_USERS),
    getAllUsersController
);
userRouter.post("/login", loginController);
userRouter.delete("/logout", checkAuth, logoutController);
userRouter.get("/me", checkAuth, getLoggedInUserController);

export default userRouter;
