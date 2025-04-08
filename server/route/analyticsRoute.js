import { Router } from "express";
import { checkAuth } from "../middleware/common/authorization.middleware.js";
import {
    getAssignedTaskStatusStatsByUserController,
    getCreatedTaskStatusStatsByUserController,
    getTasksWithUpcomingDeadlinesByUserController,
    getTasksWithOverdueDeadlinesByUserController,
    getWorkloadByUserController,
} from "../controller/analytics..controller.js";

const analyticsRouter = Router();

// Middleware to ensure the user is authenticated
analyticsRouter.use(checkAuth);

// Route to get assigned task status stats by user
analyticsRouter.get(
    "/assigned-task-status/:userId?",
    getAssignedTaskStatusStatsByUserController
);

// Route to get created task status stats by user
analyticsRouter.get(
    "/created-task-status/:userId?",
    getCreatedTaskStatusStatsByUserController
);

// Route to get tasks with upcoming deadlines by user
analyticsRouter.get(
    "/upcoming-deadlines/:userId?",
    getTasksWithUpcomingDeadlinesByUserController
);

// Route to get tasks with overdue deadlines by user
analyticsRouter.get(
    "/overdue-deadlines/:userId?",
    getTasksWithOverdueDeadlinesByUserController
);

// Route to get workload by user
analyticsRouter.get("/workload/:userId?", getWorkloadByUserController);

export default analyticsRouter;