import { prisma } from "../db/setupDB.js";

async function main() {
    const permissions = [
        { name: "CREATE_USER" },
        { name: "BLOCK_USER" },
        { name: "UPDATE_USER" },
        { name: "VIEW_USERS" },
        { name: "CREATE_TASK" },
        { name: "DELETE_TASK" },
        { name: "UPDATE_TASK" },
        { name: "VIEW_TASKS" },
    ];

    for (const permission of permissions) {
        await prisma.permission.upsert({
            where: { name: permission.name },
            update: {},
            create: permission,
        });
    }

    console.log("✅ Permissions seeded successfully!");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
