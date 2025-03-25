import { prisma } from "../db/setupDB.js";

/*
    Default roles and their permissions:
    - ADMIN: All permissions
    - DEV: VIEW_ASSIGNED_TASK, VIEW_TASK, UPDATE_TASK_STATUS
    - PROJECT_MANAGER: VIEW_ASSIGNED_TASK, VIEW_TASK, VIEW_TASK_ASSIGNEES,
        UPDATE_TASK_STATUS, ASSIGN_TASK, CREATE_TASK, DELETE_TASK, UPDATE_TASK
*/
async function main() {
    const permissions = [
        { name: "CREATE_USER" },
        { name: "BLOCK_USER" },
        { name: "UPDATE_USER" },
        { name: "VIEW_USERS" },
        { name: "VIEW_USER" },
        { name: "VIEW_TASK_ASSIGNEES" },
        { name: "CREATE_TASK" },
        { name: "DELETE_TASK" },
        { name: "UPDATE_TASK" },
        { name: "VIEW_TASKS" },
        { name: "VIEW_ASSIGNED_TASK" },
        { name: "ASSIGN_TASK" },
        { name: "VIEW_TASK" },
        { name: "UPDATE_TASK_STATUS" },
    ];

    for (const permission of permissions) {
        await prisma.permission.upsert({
            where: { name: permission.name },
            update: {},
            create: permission,
        });
    }

    console.log("✅ Permissions seeded successfully!");

    const roles = [
        {
            name: "ADMIN",
            permissions: permissions.map((permission) => ({
                name: permission.name,
            })),
        },
        {
            name: "DEV",
            permissions: [
                { name: "VIEW_ASSIGNED_TASK" },
                { name: "VIEW_TASK" },
                { name: "UPDATE_TASK_STATUS" },
            ],
        },
        {
            name: "PROJECT_MANAGER",
            permissions: [
                { name: "VIEW_ASSIGNED_TASK" },
                { name: "VIEW_TASK" },
                { name: "VIEW_TASK_ASSIGNEES" },
                { name: "UPDATE_TASK_STATUS" },
                { name: "ASSIGN_TASK" },
                { name: "CREATE_TASK" },
                { name: "DELETE_TASK" },
                { name: "UPDATE_TASK" },
            ],
        },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: {
                permissions: {
                    set: role.permissions,
                },
            },
            create: {
                name: role.name,
                permissions: {
                    connect: role.permissions,
                },
            },
        });
    }    

    console.log("✅ Roles and permissions seeded successfully!");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
