import ApiError from "../ApiError.js";

export const EmailTemplates = {
    USER_CREATED: (userName, email, tempPassword) => {
        if (!userName || !email || !tempPassword) {
            throw new ApiError(
                400,
                "Missing required parameters for USER_CREATED template"
            );
        }
        return {
            subject: `Welcome to TaskPro, ${userName}!`,
            body: `Hi ${userName},
  
Your account has been created successfully.

Login Credentials:
Email: ${email}
Password: ${tempPassword}

Welcome to the team once again!

Thanks,  
TaskPro Team`,
            html: `
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Your account has been created successfully.</p>
                <p><strong>Login Credentials:</strong></p>
                <ul>
                    <li>Email: ${email}</li>
                    <li>Password: ${tempPassword}</li>
                </ul>
                <p>Welcome to the team once again!</p>
                <p>Thanks,<br>TaskPro Team</p>
            `,
        };
    },

    USER_BLOCKED: (userName) => {
        if (!userName) {
            throw new ApiError(
                400,
                "Missing required parameter for USER_BLOCKED template"
            );
        }
        return {
            subject: `Your account has been blocked`,
            body: `Hi ${userName},
  
Your account has been temporarily blocked by an administrator. You will not be able to access the system until it is unblocked.

If you believe this was a mistake, please contact support.

Regards,  
TaskPro Team`,
            html: `
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Your account has been temporarily blocked by an administrator. You will not be able to access the system until it is unblocked.</p>
                <p>If you believe this was a mistake, please contact support.</p>
                <p>Regards,<br>TaskPro Team</p>
            `,
        };
    },

    USER_UNBLOCKED: (userName) => {
        if (!userName) {
            throw new ApiError(
                400,
                "Missing required parameter for USER_BLOCKED template"
            );
        }
        return {
            subject: `Your account has been blocked`,
            body: `Hi ${userName},
  
Your account has been unblocked by an administrator. You can now access the system.

Regards,  
TaskPro Team`,
            html: `
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Your account has been unblocked by an administrator. You can now access the system.</p>
                <p>Regards,<br>TaskPro Team</p>
            `,
        };
    },

    TASK_ASSIGNED: (userName, task) => {
        if (
            !userName ||
            !task ||
            !task.title ||
            !task.description ||
            !task.deadline ||
            !task.priority
        ) {
            throw new ApiError(
                400,
                "Missing required parameters for TASK_ASSIGNED template"
            );
        }
        const formattedDeadline = new Date(task.deadline).toLocaleDateString(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
        return {
            subject: `New Task Assigned: ${task.title}`,
            body: `Hi ${userName},
  
You have been assigned a new task:

Title: ${task.title}  
Description: ${task.description}  
Deadline: ${formattedDeadline}  
Priority: ${task.priority}  

Please check your dashboard to get started.

Best,  
TaskPro Team`,
            html: `
                <p>Hi <strong>${userName}</strong>,</p>
                <p>You have been assigned a new task:</p>
                <ul>
                    <li><strong>Title:</strong> ${task.title}</li>
                    <li><strong>Description:</strong> ${task.description}</li>
                    <li><strong>Deadline:</strong> ${formattedDeadline}</li>
                    <li><strong>Priority:</strong> ${task.priority}</li>
                </ul>
                <p>Please check your dashboard to get started.</p>
                <p>Best,<br>TaskPro Team</p>
            `,
        };
    },

    TASK_UNASSIGNED: (userName, taskTitle, newAssignee, assigner) => {
        if (!userName || !taskTitle || !newAssignee || !assigner) {
            throw new ApiError(
                400,
                "Missing required parameters for TASK_UNASSIGNED template"
            );
        }
        return {
            subject: `Task Reassigned: ${taskTitle}`,
            body: `Hi ${userName},
  
The task "${taskTitle}" which was previously assigned to you has been reassigned to ${newAssignee}.

If you have any questions regarding this change, please contact ${assigner}.

Regards,  
TaskPro Team`,
            html: `
                <p>Hi <strong>${userName}</strong>,</p>
                <p>The task "<strong>${taskTitle}</strong>" which was previously assigned to you has been reassigned to <strong>${newAssignee}</strong>.</p>
                <p>If you have any questions regarding this change, please contact <strong>${assigner}</strong>.</p>
                <p>Regards,<br>TaskPro Team</p>
            `,
        };
    },

    TASK_STATUS_UPDATED: (userName, taskTitle, newStatus) => {
        if (!userName || !taskTitle || !newStatus) {
            throw new ApiError(
                400,
                "Missing required parameters for TASK_STATUS_UPDATED template"
            );
        }
        return {
            subject: `Task Status Updated: ${taskTitle}`,
            body: `Hi ${userName},
  
The status of the task "${taskTitle}" has been updated to "${newStatus}".

Check your dashboard for more details.

Best,  
TaskPro Team`,
            html: `
                <p>Hi <strong>${userName}</strong>,</p>
                <p>The status of the task "<strong>${taskTitle}</strong>" has been updated to "<strong>${newStatus}</strong>".</p>
                <p>Check your dashboard for more details.</p>
                <p>Best,<br>TaskPro Team</p>
            `,
        };
    },

    PASSWORD_CHANGED: (userName) => {
        if (!userName) {
            throw new ApiError(
                400,
                "Missing required parameter for PASSWORD_CHANGED template"
            );
        }
        return {
            subject: `Your Password Has Been Changed`,
            body: `Hi ${userName},
  
Your password has been successfully changed. If you did not make this change, please contact support immediately.

Regards,  
TaskPro Team`,
            html: `
                <p>Hi <strong>${userName}</strong>,</p>
                <p>Your password has been successfully changed. If you did not make this change, please contact support immediately.</p>
                <p>Regards,<br>TaskPro Team</p>
            `,
        };
    },
};
