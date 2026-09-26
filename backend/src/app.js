import express from "express";
import cors from "cors";
import userRoutes from "./Routes/User.route.js";
import { Meeting } from "./Models/Meeting.model.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "*"
}));
app.use(express.json({ limit: "40Kb" }));
app.use(express.urlencoded({ limit: "40Kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/api/v1/meeting/check/:code", async (req, res) => {
    const { code } = req.params;
    try {
        const meeting = await Meeting.findOne({ meetingCode: code });
        res.json({ active: !!meeting });
    } catch (e) {
        res.status(500).json({ active: false, message: "Something went wrong" });
    }
});

app.post("/api/v1/meeting/mark-started/:code", async (req, res) => {
    const { code } = req.params;
    try {
        await Meeting.updateMany(
            { meetingCode: code, startedAt: { $exists: false } },
            { startedAt: new Date() }
        );
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'online', timestamp: new Date() });
});

export default app;