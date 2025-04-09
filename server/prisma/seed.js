import { prisma } from "../db/setupDB.js";
import { UserPermissions } from "../util/constant.js";
import bcrypt from "bcrypt";

/*
    Default roles and their permissions:
    - ADMIN: All permissions
    - DEV: VIEW_ASSIGNED_TASK, VIEW_TASK, UPDATE_TASK_STATUS
    - PROJECT_MANAGER: VIEW_ASSIGNED_TASK, VIEW_TASK, VIEW_TASK_ASSIGNEES,
        UPDATE_TASK_STATUS, ASSIGN_TASK, CREATE_TASK, DELETE_TASK, UPDATE_TASK
*/
async function main() {
    // Seed permissions
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

    // Seed roles
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

    // Check if there are any users in the database
    const userCount = await prisma.user.count();
    if (userCount === 0) {
        // Seed an admin user
        const adminRole = await prisma.role.findUnique({
            where: { name: "ADMIN" },
        });

        if (!adminRole) {
            throw new Error("Admin role not found. Please seed roles first.");
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10); // Default admin password

        await prisma.user.create({
            data: {
                name: "Admin User",
                email: "admin@example.com",
                password: hashedPassword,
                roleId: adminRole.id,
            },
        });

        console.log("✅ Admin user seeded successfully!");
        console.log("Admin credentials:");
        console.log("Email: admin@example.com");
        console.log("Password: Admin@123");
    } else {
        console.log("✅ Users already exist. Skipping admin user seeding.");
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
