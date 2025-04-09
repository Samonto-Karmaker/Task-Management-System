import ApiError from "../ApiError";

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
        };
    },

    TASK_ASSIGNED: (userName, task) => {
        if (
            !userName ||
            !task ||
            !task.title ||
            !task.description ||
            !task.deadline ||
            !task.priority ||
            !task.assigner
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
Assigner: ${task.assigner.name}

Please check your dashboard to get started.

Best,  
TaskPro Team`,
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
        };
    },
};
