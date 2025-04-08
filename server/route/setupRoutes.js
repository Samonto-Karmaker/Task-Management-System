import { BASE_URL } from "../util/constant.js";
import analyticsRouter from "./analyticsRoute.js";
import rolePermissionRouter from "./rolePermissionRoute.js";
import taskRouter from "./taskRoute.js";
import testRouter from "./testRoute.js";
import userRouter from "./userRoute.js";

export const setupRoutes = (app) => {
    app.use(`${BASE_URL}/test`, testRouter);
    app.use(`${BASE_URL}/`, userRouter);
    app.use(`${BASE_URL}/role-permission`, rolePermissionRouter);
    app.use(`${BASE_URL}/task`, taskRouter);
    app.use(`${BASE_URL}/analytics`, analyticsRouter);
}