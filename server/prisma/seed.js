import { prisma } from "../db/setupDB.js";
import { UserPermissions } from "../util/constant.js";

/*
    Default roles and their permissions:
    - ADMIN: All permissions
    - DEV: VIEW_ASSIGNED_TASK, VIEW_TASK, UPDATE_TASK_STATUS
    - PROJECT_MANAGER: VIEW_ASSIGNED_TASK, VIEW_TASK, VIEW_TASK_ASSIGNEES,
        UPDATE_TASK_STATUS, ASSIGN_TASK, CREATE_TASK, DELETE_TASK, UPDATE_TASK
*/
async function main() {
    const permissions = Object.values(UserPermissions).map((permission) => ({
        name: permission,
    }));

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
                { name: UserPermissions.VIEW_ASSIGNED_TASK },
                { name: UserPermissions.VIEW_TASK },
                { name: UserPermissions.UPDATE_TASK_STATUS },
            ],
        },
        {
            name: "PROJECT_MANAGER",
            permissions: [
                { name: UserPermissions.VIEW_ASSIGNED_TASK },
                { name: UserPermissions.VIEW_TASK },
                { name: UserPermissions.VIEW_TASK_ASSIGNEES },
                { name: UserPermissions.UPDATE_TASK_STATUS },
                { name: UserPermissions.ASSIGN_TASK },
                { name: UserPermissions.CREATE_TASK },
                { name: UserPermissions.DELETE_TASK },
                { name: UserPermissions.UPDATE_TASK },
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
