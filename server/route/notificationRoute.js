import { Router } from "express";
import { checkAuth } from "../middleware/common/authorization.middleware.js";
import {
    getInAppNotificationsController,
    getUnreadNotificationsCountController,
} from "../controller/notification.controller.js";

const notificationRouter = Router();
notificationRouter.use(checkAuth);

notificationRouter.get(
    "/in-app-notifications",
    getInAppNotificationsController
);

notificationRouter.get(
    "/unread-notifications-count",
    getUnreadNotificationsCountController
);

export default notificationRouter;
