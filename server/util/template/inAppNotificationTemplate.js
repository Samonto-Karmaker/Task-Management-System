const inAppNotificationTemplate = {
    TASK_ASSIGNED: (taskName, taskId, assignedBy) => {
        return `You have been assigned a new task: ${taskName}. Task ID: ${taskId}. Assigned by: ${assignedBy}.`;
    },
    TASK_STATUS_UPDATED: (taskName, taskId, status) => {
        return `The status of task ${taskName} (ID: ${taskId}) has been updated to: ${status}.`;
    },
    TASK_DETAILS_UPDATED: (taskName, taskId, updatedBy) => {
        return `The details of task ${taskName} (ID: ${taskId}) have been updated by: ${updatedBy}.`;
    },
    TASK_DELETED: (taskName, taskId) => {
        return `The task ${taskName} (ID: ${taskId}) has been deleted.`;
    },
    TASK_REASSIGNED: (taskName, taskId, reassignedBy) => {
        return `The task ${taskName} (ID: ${taskId}) has been reassigned by: ${reassignedBy}.`;
    },
};

export default inAppNotificationTemplate;
