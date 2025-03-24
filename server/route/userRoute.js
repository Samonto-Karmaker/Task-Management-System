import { Router } from "express";
import {
    createUserValidationResult,
    createUserValidator,
} from "../middleware/user/createUserValidator.middleware";
import { createUserController } from "../controller/user.controller";

const userRouter = Router();

userRouter.post(
    "/create-user",
    createUserValidator,
    createUserValidationResult,
    createUserController
);

export default userRouter;
