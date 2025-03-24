import { Router } from "express";
import {
    createUserValidationResult,
    createUserValidator,
} from "../middleware/user/createUserValidator.middleware.js";
import { createUserController, getAllUsersController, loginController, logoutController } from "../controller/user.controller.js";
import { checkAuth, checkRole } from "../middleware/common/authorization.middleware.js";
import { Role } from "../util/constant.js";

const userRouter = Router();

userRouter.post(
    "/",
    checkAuth,
    checkRole([Role.ADMIN]),
    createUserValidator,
    createUserValidationResult,
    createUserController
);
userRouter.get("/", checkAuth, checkRole([Role.ADMIN]), getAllUsersController);
userRouter.post("/login", loginController);
userRouter.delete("/logout", logoutController);

export default userRouter;
