import { Router } from "express";
import {
    createUserValidationResult,
    createUserValidator,
} from "../middleware/user/createUserValidator.middleware.js";
import { createUserController, getAllUsersController, loginController, logoutController } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.post(
    "/",
    createUserValidator,
    createUserValidationResult,
    createUserController
);
userRouter.get("/", getAllUsersController);
userRouter.post("/login", loginController);
userRouter.delete("/logout", logoutController);

export default userRouter;
