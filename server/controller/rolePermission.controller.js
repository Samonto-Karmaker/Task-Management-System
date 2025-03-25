import { createCustomRoles, getAllPermissions, getRolePermissions } from "../service/rolePermission.service.js";
import ApiResponse from "../util/ApiResponse.js";
import { finalResErrorHandler } from "../util/finalResErrorHandler.js";

export const getAllPermissionsController = async (req, res) => {
    try {
        const permissions = await getAllPermissions();
        res.status(200).json(new ApiResponse(200, "Permissions retrieved", permissions));
    } catch (error) {
        finalResErrorHandler(error, res);
    }
}

export const getRolePermissionsController = async (req, res) => {
    const { roleId } = req.params;
    try {
        const permissions = await getRolePermissions(roleId);
        res.status(200).json(new ApiResponse(200, "Permissions retrieved", permissions));
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const createCustomRolesController = async (req, res) => {
    const { name, permissions } = req.body;
    try {
        const newRole = await createCustomRoles(name, permissions);
        res.status(201).json(new ApiResponse(201, "Role created", newRole));
    } catch (error) {
        finalResErrorHandler(error, res);
    }
}