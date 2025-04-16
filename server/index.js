import dotenv from "dotenv";
import app from "./app.js";
import { createSocketServer } from "./util/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const { server, io } = createSocketServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Socket server is running`);
});

export { io };
