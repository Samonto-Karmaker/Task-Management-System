import { Router } from "express";
import { testController, testRedisController } from "../controller/test.controller.js";

const testRouter = Router();

testRouter.get("/", testController);

testRouter.get("/redis", testRedisController);

export default testRouter;