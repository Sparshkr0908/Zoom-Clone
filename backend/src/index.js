import dotenv from "dotenv";
dotenv.config();

import express from "express";
import {createServer} from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./Controllers/SocketManager.js";

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

const start = async() =>{
    server.listen(PORT,()=>{
        console.log(`Listen to port ${PORT}`);
         mongoose.connect(uri);
    console.log("MongoDB connected successfully.");
    });
}

start();