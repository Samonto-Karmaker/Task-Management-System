import ApiResponse from "../util/ApiResponse.js";
import { createUser, getAllUsers, login } from "../service/user.service.js";
import jwt from "jsonwebtoken";
import ms from "ms";
import { finalResErrorHandler } from "../util/finalResErrorHandler.js";

export const createUserController = async (req, res) => {
    const { name, email, password, roleId } = req.body;
    try {
        const newUser = await createUser({ name, email, password, roleId });
        res.status(201).json(new ApiResponse(201, "User created", newUser));
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.status(200).json(new ApiResponse(200, "Users retrieved", users));
    } catch (error) {
        finalResErrorHandler(error, res);
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
            signed: true,
            maxAge: ms(process.env.JWT_EXPIRY),
        });

        res.status(200).json(new ApiResponse(200, "Login successful", user));
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};

export const logoutController = async (req, res) => {
    try {
        res.clearCookie(process.env.COOKIE_NAME);
        res.status(200).json(new ApiResponse(200, "Logout successful"));
    } catch (error) {
        finalResErrorHandler(error, res);
    }
};
