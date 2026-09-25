import dotenv from "dotenv";
dotenv.config();

import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket, isMeetingActive } from "./Controllers/SocketManager.js";

import userRoutes from "./Routes/User.route.js";

const uri = process.env.MONGO_URL;

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const PORT =process.env.PORT || 5501;
app.use(cors());
app.use(express.json({limit: "40Kb"}));
app.use(express.urlencoded({limit: "40Kb", extended: true}));

app.use("/api/v1/users", userRoutes);

app.get("/api/v1/meeting/check/:code", (req, res) => {
    const { code } = req.params;
    const active = isMeetingActive(code);
    res.json({ active });
});

app.post("/api/v1/meeting/mark-started/:code", async (req, res) => {
    const { code } = req.params;
    try {
        await Meeting.findOneAndUpdate(
            { meetingCode: code, startedAt: { $exists: false } },
            { startedAt: new Date() } 
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

const start = async() =>{
    try {
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully.");
        server.listen(PORT, ()=>{
            console.log(`Listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        process.exit(1);
    }
}

start();