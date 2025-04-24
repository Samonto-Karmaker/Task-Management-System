import { Router } from "express";
import {
    createUserValidationResult,
    createUserValidator,
} from "../middleware/user/createUserValidator.middleware.js";
import {
    changePasswordController,
    createUserController,
    getAllUsersController,
    getLoggedInUserController,
    getUserByIdController,
    loginController,
    logoutController,
    toggleBlockUserController,
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
    createUserValidator(false),
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
userRouter.patch(
    "/toggle-block/:id",
    checkAuth,
    checkRole(UserPermissions.BLOCK_USER),
    toggleBlockUserController
);
userRouter.get(
    "/user/:id",
    checkAuth,
    checkRole(UserPermissions.VIEW_USER),
    getUserByIdController
);
userRouter.patch(
    "/change-password",
    checkAuth,
    createUserValidator(true),
    createUserValidationResult,
    changePasswordController
);

export default userRouter;
