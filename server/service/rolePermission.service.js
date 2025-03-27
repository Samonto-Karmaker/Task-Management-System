import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";

export const createCustomRoles = async (name, permissionIds) => {
    if (!name || !permissionIds) {
        throw new ApiError(400, "Missing required fields");
    }
    name = name.toUpperCase().split(" ").join("_");
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

export const getRolePermissions = async (roleId) => {
    if (!roleId) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const role = await prisma.role.findUnique({
            where: { id: roleId },
            select: { permissions: { select: { id: true, name: true } }, name: true},
        });
        if (!role) {
            throw new ApiError(404, "Role not found");
        }
        return { role: role.name, permissions: role.permissions };
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) throw error;
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getAllRoles = async () => {
    try {
        const roles = await prisma.role.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        });
        return roles;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getAllPermissions = async () => {
    try {
        const permissions = await prisma.permission.findMany(
            { select: { id: true, name: true } }
        );
        return permissions;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal Server Error");
    }
};
