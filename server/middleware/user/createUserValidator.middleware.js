import { check, validationResult } from "express-validator";
import ApiError from "../../util/ApiError.js";
import { prisma } from "../../db/setupDB.js";
import ApiResponse from "../../util/ApiResponse.js";
import { isFieldRequired } from "../../util/isFieldRequire.js";

export const createUserValidator = (isUpdate = false) => [
    check("name")
        .if(isFieldRequired(isUpdate))
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .trim(),
    check("email")
        .if(isFieldRequired(isUpdate))
        .isEmail()
        .withMessage("Email must be valid"),
    check("password")
        .if(isFieldRequired(isUpdate))
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    check("roleId")
        .if(isFieldRequired(isUpdate))
        .isUUID()
        .withMessage("Role ID must be a valid UUID")
        .custom(async (value) => {
            const existingRole = await prisma.role.findUnique({
                where: { id: value },
            });
            if (!existingRole) {
                throw new ApiError(400, "Role does not exist");
            }
        }),
];

export const createUserValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        return next();
    }
    res.status(400).json(
        new ApiResponse(400, "Validation failed", mappedErrors)
    );
};
