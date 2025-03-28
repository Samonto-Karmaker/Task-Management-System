import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";
import bcrypt from "bcrypt";
import { getRolePermissions } from "./rolePermission.service.js";

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
            select: { id: true, name: true, email: true, role: true, isBlocked: true },
        })
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
