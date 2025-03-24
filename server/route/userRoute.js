import { Router } from "express";
import {
    createUserValidationResult,
    createUserValidator,
} from "../middleware/user/createUserValidator.middleware.js";
import { createUserController, getAllUsersController } from "../controller/user.controller.js";

const userRouter = Router();

userRouter.post(
    "/",
    createUserValidator,
    createUserValidationResult,
    createUserController
);
userRouter.get("/", getAllUsersController);

export default userRouter;
