import ApiResponse from "../util/ApiResponse.js";
import { createUser, getAllUsers, login } from "../service/user.service.js";
import jwt from "jsonwebtoken";
import ms from "ms";

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

export const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await login({ email, password });
        const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY,
        });

        res.cookie(process.env.COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: ms(process.env.JWT_EXPIRY),
        });

        res.status(200).json(new ApiResponse(200, "Login successful", user));
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

export const logoutController = async (req, res) => {
    try {
        res.clearCookie(process.env.COOKIE_NAME);
        res.status(200).json(new ApiResponse(200, "Logout successful"));
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
