import { Router } from "express";
import {
    createCustomRolesController,
    getAllPermissionsController,
    getRolePermissionsController,
} from "../controller/rolePermission.controller.js";

const rolePermissionRouter = Router();

rolePermissionRouter.get("/", getAllPermissionsController);
rolePermissionRouter.post("/", createCustomRolesController);
rolePermissionRouter.get("/:roleId", getRolePermissionsController);

export default rolePermissionRouter;
