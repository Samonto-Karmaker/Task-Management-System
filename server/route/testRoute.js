import { Router } from "express";
import { testController } from "../controller/test.controller.js";

const testRouter = Router();

testRouter.get("/", testController);

export default testRouter;