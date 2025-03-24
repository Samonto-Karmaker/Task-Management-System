import ApiResponse from "../util/ApiResponse.js";
import { createUser, getAllUsers } from "../service/user.service.js";

export const createUserController = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const newUser = await createUser({ name, email, password, role });
        res.status(201).json(new ApiResponse(201, "User created", newUser));
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

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(new ApiResponse(200, "Users retrieved", users));
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
