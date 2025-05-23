export enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}

export enum UserPermissions {
    CREATE_USER = "CREATE_USER",
    BLOCK_USER = "BLOCK_USER",
    UPDATE_USER = "UPDATE_USER",
    VIEW_USERS = "VIEW_USERS",
    VIEW_USER = "VIEW_USER",

    VIEW_TASK_ASSIGNEES = "VIEW_TASK_ASSIGNEES",
    CREATE_TASK = "CREATE_TASK",
    DELETE_TASK = "DELETE_TASK",
    UPDATE_TASK = "UPDATE_TASK",
    VIEW_TASKS = "VIEW_TASKS",
    VIEW_ASSIGNED_TASK = "VIEW_ASSIGNED_TASK",
    ASSIGN_TASK = "ASSIGN_TASK",
    VIEW_TASK = "VIEW_TASK",
    UPDATE_TASK_STATUS = "UPDATE_TASK_STATUS",

    CREATE_ROLE = "CREATE_ROLE",
}
