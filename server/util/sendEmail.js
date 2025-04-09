import nodemailer from "nodemailer";
import dotenv from "dotenv";
import ApiError from "./ApiError.js";

dotenv.config();

export const sendEmail = async (to, subject, text, html) => {
    if (!to || !subject || !text || !html) {
        throw new ApiError(400, "Missing required fields");
    }
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false, // true for port 465, false for others like 587
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent: %s", info.messageId);
        if (process.env.NODE_ENV === "development") {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new ApiError(500, "Failed to send email");
    }
};
