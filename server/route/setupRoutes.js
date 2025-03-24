import { BASE_URL } from "../util/constant.js";
import rolePermissionRouter from "./rolePermissionRoutes.js";
import testRouter from "./testRoute.js";
import userRouter from "./userRoute.js";

export const setupRoutes = (app) => {
    app.use(`${BASE_URL}/test`, testRouter);
    app.use(`${BASE_URL}/`, userRouter);
    app.use(`${BASE_URL}/role-permission`, rolePermissionRouter);
}