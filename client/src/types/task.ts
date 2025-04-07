import { Priority } from "@/utils/constant";
import { TaskStatus } from "@/utils/constant";

export type Task = {
    id: string;
    title: string;
    priority: Priority;
    deadline: string;
    status: TaskStatus;
    assigner?: {
        id: string;
        name: string;
    };
    assignee?: {
        id: string;
        name: string;
    };
}