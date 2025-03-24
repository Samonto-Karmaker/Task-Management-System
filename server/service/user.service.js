import ApiError from "../util/ApiError.js";
import { prisma } from "../db/setupDB.js";

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

        // Create user
        const newUser = await prisma.user.create({
            data: { name, email, password, role },
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
