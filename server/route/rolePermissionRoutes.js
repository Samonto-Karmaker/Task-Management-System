import { Router } from "express";
import { getAllPermissionsController } from "../controller/rolePermission.controller.js";

const rolePermissionRouter = Router();

rolePermissionRouter.get("/", getAllPermissionsController);

export default rolePermissionRouter;
