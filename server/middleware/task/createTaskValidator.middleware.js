import { check, validationResult } from "express-validator";
import ApiError from "../../util/ApiError.js";
import { prisma } from "../../db/setupDB.js";
import ApiResponse from "../../util/ApiResponse.js";
import { Priority } from "@prisma/client";

export const createTaskValidator = [
    check("name")
        .length({ min: 3, max: 127 })
        .withMessage("Task name must be at least 3 characters long and less than 127 characters"),
    check("description")
        .length({ min: 3, max: 255 })
        .withMessage("Task description must be at least 3 characters long and less than 255 characters"),
    check("priority")
        .isIn(Object.values(Priority))
        .withMessage("Priority must be one of LOW, MEDIUM, HIGH"),
    check("deadline")
        .isISO8601()
        .withMessage("Deadline must be a valid date in ISO8601 format")
        .custom((value) => {
            if (new Date(value) < new Date()) {
                throw new ApiError(400, "Deadline must be in the future");
            }
            return true;
        }),
    check("assignerId")
        .isUUID()
        .withMessage("Assigner ID must be a valid UUID")
        .custom(async (value) => {
            const user = await prisma.user.findUnique({ where: { id: value } });
            if (!user) {
                throw new ApiError(404, "Assigner not found");
            }
            return true;
        }),
    check("assigneeId")
        .isUUID()
        .withMessage("Assignee ID must be a valid UUID")
        .custom(async (value) => {
            const user = await prisma.user.findUnique({ where: { id: value } });
            if (!user) {
                throw new ApiError(404, "Assignee not found");
            }
            return true;
        }),
];

export const createTaskValidatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        return next();
    }
    res.status(400).json(new ApiResponse(400, "Validation failed", mappedErrors));
};