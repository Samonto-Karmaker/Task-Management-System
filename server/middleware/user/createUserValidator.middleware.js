import { check, validationResult } from "express-validator";
import { Role } from "../../util/constant.js";
import ApiError from "../../util/ApiError.js";

export const createUserValidator = [
    check("name")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .trim(),
    check("email").isEmail().withMessage("Email must be valid"),
    check("password")
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)
        .withMessage(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        )
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
    check("role")
        .isIn(Object.values(Role))
        .withMessage("Role must be one of DEV, PROJECT_MANAGER, ADMIN"),
];

export const createUserValidationResult = (req, res, next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        return next();
    }
    res.status(400).json(new ApiError(400, "Validation failed", mappedErrors));
};
