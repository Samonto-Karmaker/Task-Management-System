import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";
import bcrypt from "bcrypt";

export const createUser = async ({ name, email, password, role }) => {
    if (!name || !email || !password || !role) {
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
            data: { name, email, password: hashedPassword, role },
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
            select: { id: true, name: true, email: true, role: true },
        })
        return users;
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal Server Error");
    }
};
