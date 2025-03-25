import { Router } from "express";
import { getAllPermissionsController, getRolePermissionsController } from "../controller/rolePermission.controller.js";

const rolePermissionRouter = Router();

rolePermissionRouter.get("/", getAllPermissionsController);
rolePermissionRouter.get("/:roleId", getRolePermissionsController);

export default rolePermissionRouter;
