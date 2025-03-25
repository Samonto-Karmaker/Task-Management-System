import ApiResponse from "./ApiResponse.js";

export const finalResErrorHandler = (error, res) => {
    console.error(error);
    res.status(error.statusCode || 500).json(
        new ApiResponse(
            error.statusCode || 500,
            error.message || "Internal Server Error",
            error.errors || null
        )
    );
};
