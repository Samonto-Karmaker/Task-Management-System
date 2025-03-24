import ApiResponse from "../util/ApiResponse.js";

export const testController = (req, res) => {
    res.status(200).json(new ApiResponse(200, "Test controller is working"));
}