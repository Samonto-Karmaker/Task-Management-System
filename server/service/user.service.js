import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";
import bcrypt from "bcrypt";
import { getRolePermissions } from "./rolePermission.service.js";
import { UserPermissions } from "../util/constant.js";
import { EmailTemplates } from "../util/template/emailTemplate.js";
import { notifyEmail } from "./notification.service.js";

export const createUser = async ({ name, email, password, roleId }) => {
    if (!name || !email || !password || !roleId) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            select: { id: true },
            where: { email },
        });
        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, roleId },
        });

        // Send email notification
        if (newUser) {
            const emailTemplate = EmailTemplates.USER_CREATED(
                newUser.name,
                newUser.email,
                password
            );
            notifyEmail(newUser.id, emailTemplate).catch((error) => {
                console.error("Failed to send email:", error);
            });
        }

        return newUser;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getAllUsers = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isBlocked: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });
        return users;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal Server Error");
    }
};

export const login = async ({ email, password }) => {
    if (!email || !password) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new ApiError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new ApiError(401, "Invalid credentials");
        }
        if (user.isBlocked) {
            throw new ApiError(403, "User is blocked");
        }

        const permissions = await getRolePermissions(user.roleId);
        const userWithPermissions = { ...user, permissionInfo: permissions };

        return userWithPermissions;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getUsersWithPermission = async (permissionName) => {
    if (!permissionName) {
        throw new ApiError(400, "Permission name is required");
    }
    if (!Object.values(UserPermissions).includes(permissionName)) {
        throw new ApiError(400, "Invalid permission name");
    }
    try {
        const users = await prisma.user.findMany({
            where: {
                role: {
                    permissions: {
                        some: {
                            name: permissionName,
                        },
                    },
                },
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return users;
    } catch (error) {
        console.error(error);
        throw new ApiError(
            500,
            "Failed to fetch users with the specified permission"
        );
    }
};

export const toggleBlockUser = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isBlocked: true },
        });
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isBlocked: !user.isBlocked },
            select: {
                id: true,
                name: true,
                email: true,
                isBlocked: true,
            },
        });

        if (updatedUser) {
            let emailTemplate;
            if (updatedUser.isBlocked) {
                emailTemplate = EmailTemplates.USER_BLOCKED(updatedUser.name);
            } else {
                emailTemplate = EmailTemplates.USER_UNBLOCKED(updatedUser.name);
            }
            notifyEmail(userId, emailTemplate).catch((error) => {
                console.error("Failed to send email:", error);
            });
        }

        return updatedUser;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
};

export const getUserById = async (userId) => {
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                isBlocked: true,
            },
        });
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        return user;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
};

export const changePassword = async (userId, newPassword) => {
    if (!userId || !newPassword) {
        throw new ApiError(400, "User ID and new password are required");
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true },
        });
        if (!user) {
            throw new ApiError(404, "User not found");
        }
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            throw new ApiError(
                400,
                "New password cannot be the same as the old password"
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });

        if (updatedUser) {
            const emailData = EmailTemplates.PASSWORD_CHANGED(updatedUser.name);
            notifyEmail(userId, emailData).catch((error) => {
                console.error("Failed to send email:", error);
            });
        }

        return updatedUser;
    } catch (error) {
        console.error(error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
};
