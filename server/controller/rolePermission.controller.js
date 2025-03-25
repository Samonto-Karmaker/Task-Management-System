import { getAllPermissions, getRolePermissions } from "../service/rolePermission.service.js";
import ApiResponse from "../util/ApiResponse.js";

export const getAllPermissionsController = async (req, res) => {
    try {
        const permissions = await getAllPermissions();
        res.status(200).json(new ApiResponse(200, "Permissions retrieved", permissions));
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json(
            new ApiResponse(
                error.statusCode || 500,
                error.message || "Internal Server Error",
                error.errors || null
            )
        );
    }
}

export const getRolePermissionsController = async (req, res) => {
    const { roleId } = req.params;
    try {
        const permissions = await getRolePermissions(roleId);
        res.status(200).json(new ApiResponse(200, "Permissions retrieved", permissions));
    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json(
            new ApiResponse(
                error.statusCode || 500,
                error.message || "Internal Server Error",
                error.errors || null
            )
        );
    }
};