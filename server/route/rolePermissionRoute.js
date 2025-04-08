import { Router } from "express";
import {
    createCustomRolesController,
    getAllPermissionsController,
    getAllRolesController,
    getRolePermissionsController,
} from "../controller/rolePermission.controller.js";
import {
    checkAuth,
    checkRole,
} from "../middleware/common/authorization.middleware.js";
import { UserPermissions } from "../util/constant.js";

const rolePermissionRouter = Router();

rolePermissionRouter.get("/", getAllPermissionsController);
rolePermissionRouter.get("/roles", checkAuth, getAllRolesController);
rolePermissionRouter.post(
    "/",
    checkAuth,
    checkRole(UserPermissions.CREATE_ROLE),
    createCustomRolesController
);
rolePermissionRouter.get("/:roleId", getRolePermissionsController);

export default rolePermissionRouter;
