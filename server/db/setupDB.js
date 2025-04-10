import { PrismaClient } from "@prisma/client";
import pkg from "@prisma/client";

export const prisma = new PrismaClient();
export const { TaskStatus, Priority, NotificationType } = pkg;