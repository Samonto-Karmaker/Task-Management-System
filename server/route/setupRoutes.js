import { BASE_URL } from "../util/constant.js";
import userRouter from "./userRoute.js";

export const setupRoutes = (app) => {
    app.use(`${BASE_URL}/user`, userRouter);
}