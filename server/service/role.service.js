import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";

const createCustomRoles = async (name, permissionIds) => {
    if (!name || !permissionIds) {
        throw new ApiError(400, "Missing required fields");
    }
    name = name.toUpperCase();
    try {
        const existingRoles = await prisma.role.findUnique({
            where: { name },
        });
        if (existingRoles) {
            throw new ApiError(400, "Role already exists");
        }
        const permissions = await prisma.permission.findMany({
            where: { id: { in: permissionIds } },
        });
        if (permissions.length !== permissionIds.length) {
            throw new ApiError(400, "Invalid permission IDs");
        }

        const newRole = await prisma.role.create({
            data: {
                name,
                permissions: {
                    connect: permissionIds.map((id) => ({ id })),
                },
            },
        });

        return newRole;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

const grantPermissionToRole = async () => {};

const revokePermissionFromRole = async () => {};

const getRolePermissions = async () => {};

const getRoles = async () => {};
