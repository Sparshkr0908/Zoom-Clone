import dotenv from "dotenv";
dotenv.config();

import { createServer } from "node:http";
import mongoose from "mongoose";
import app from "./app.js";
import { connectToSocket } from "./Controllers/SocketManager.js";

const uri = process.env.MONGO_URL;
const server = createServer(app);
const io = connectToSocket(server);

const PORT = process.env.PORT || 5501;

const start = async () => {
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully.");
        server.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}

start();