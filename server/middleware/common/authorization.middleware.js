import jwt from "jsonwebtoken";
import ApiResponse from "../../util/ApiResponse.js";

export const checkAuth = (req, res, next) => {
    const cookies = req.signedCookies;
    if (!cookies || !cookies[process.env.COOKIE_NAME]) {
        return res.status(401).json(new ApiResponse(401, "Unauthorized"));
    }

    try {
        const token = cookies[process.env.COOKIE_NAME];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json(new ApiResponse(401, "Unauthorized"));
        }
        return res
            .status(500)
            .json(new ApiResponse(500, "Internal Server Error"));
    }
};

export const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json(new ApiResponse(403, "Forbidden"));
    }
    next();
}
