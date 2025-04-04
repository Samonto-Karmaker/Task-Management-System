import { check, validationResult } from "express-validator";
import ApiError from "../../util/ApiError.js";
import { prisma } from "../../db/setupDB.js";
import ApiResponse from "../../util/ApiResponse.js";
import { Priority } from "@prisma/client";
import { UserPermissions } from "../../util/constant.js";
import { isFieldRequired } from "../../util/isFieldRequire.js";

export const taskValidator = (isUpdate = false) => [
    check("title")
        .if(isFieldRequired(isUpdate))
        .notEmpty()
        .withMessage("Task name is required")
        .bail()
        .isLength({ min: 3, max: 127 })
        .withMessage(
            "Task name must be at least 3 characters long and less than 127 characters"
        )
        .trim(),
    check("description")
        .if(isFieldRequired(isUpdate))
        .notEmpty()
        .withMessage("Task description is required")
        .bail()
        .isLength({ min: 3, max: 255 })
        .withMessage(
            "Task description must be at least 3 characters long and less than 255 characters"
        )
        .trim(),
    check("priority")
        .if(isFieldRequired(isUpdate))
        .notEmpty()
        .withMessage("Priority is required")
        .bail()
        .isIn(Object.values(Priority))
        .withMessage("Priority must be one of LOW, MEDIUM, HIGH"),
    check("deadline")
        .if(isFieldRequired(isUpdate))
        .notEmpty()
        .withMessage("Deadline is required")
        .bail()
        .isISO8601()
        .withMessage("Deadline must be a valid date in ISO8601 format")
        .custom((value) => {
            const now = new Date();
            now.setHours(0, 0, 0, 0); // Start of today

            const deadline = new Date(value);
            deadline.setHours(0, 0, 0, 0);

            if (deadline < now) {
                throw new ApiError(
                    400,
                    "Deadline must be today or in the future"
                );
            }
            return true;
        }),
    check("assigneeId")
        .if(isFieldRequired(isUpdate))
        .notEmpty()
        .withMessage("Assignee ID is required")
        .isUUID()
        .withMessage("Assignee ID must be a valid UUID")
        .bail()
        .custom(async (value) => {
            const assignee = await prisma.user.findUnique({
                where: { id: value },
                include: {
                    role: {
                        include: {
                            permissions: true,
                        },
                    },
                },
            });
            if (!assignee) {
                throw new ApiError(404, "Assignee not found");
            }
            const hasPermission = assignee.role?.permissions?.some(
                (permission) =>
                    permission.name === UserPermissions.UPDATE_TASK_STATUS
            );
            if (!hasPermission) {
                throw new ApiError(
                    403,
                    "Assignee does not have permission to be assigned tasks"
                );
            }
            return true;
        }),
];

export const taskValidatorMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        return next();
    }
    res.status(400).json(
        new ApiResponse(400, "Validation failed", mappedErrors)
    );
};
