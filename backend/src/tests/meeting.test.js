import request from "supertest";
import app from "../app.js";
import { connectTestDB, closeTestDB, clearTestDB } from "./setup.js";

beforeAll(async () => {
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await closeTestDB();
});

const registerAndLogin = async (username) => {
    await request(app)
        .post("/api/v1/users/register")
        .send({ name: "Meet User", username, password: "password123" });

    const loginRes = await request(app)
        .post("/api/v1/users/login")
        .send({ username, password: "password123" });

    return loginRes.body.token;
};

describe("GET /api/v1/meeting/check/:code", () => {
    it("should return false for a non-existent meeting code", async () => {
        const res = await request(app).get("/api/v1/meeting/check/doesnotexist");
        expect(res.statusCode).toBe(200);
        expect(res.body.active).toBe(false);
    });

    it("should return true after a meeting is added to history", async () => {
        const token = await registerAndLogin("hostuser");

        await request(app)
            .post("/api/v1/users/add_to_activity")
            .send({ token, meeting_code: "abc123" });

        const res = await request(app).get("/api/v1/meeting/check/abc123");
        expect(res.body.active).toBe(true);
    });
});

describe("POST /api/v1/meeting/mark-started/:code", () => {
    it("should set startedAt on all matching records", async () => {
        const hostToken = await registerAndLogin("host2");
        const joinerToken = await registerAndLogin("joiner2");

        await request(app)
            .post("/api/v1/users/add_to_activity")
            .send({ token: hostToken, meeting_code: "code999" });

        await request(app)
            .post("/api/v1/users/add_to_activity")
            .send({ token: joinerToken, meeting_code: "code999" });

        const markRes = await request(app).post("/api/v1/meeting/mark-started/code999");
        expect(markRes.statusCode).toBe(200);
        expect(markRes.body.success).toBe(true);

        const hostHistory = await request(app)
            .get("/api/v1/users/get_all_activity")
            .query({ token: hostToken });

        const joinerHistory = await request(app)
            .get("/api/v1/users/get_all_activity")
            .query({ token: joinerToken });

        expect(hostHistory.body[0].startedAt).toBeDefined();
        expect(joinerHistory.body[0].startedAt).toBeDefined();
    });

    it("should not overwrite an already-set startedAt", async () => {
        const token = await registerAndLogin("host3");

        await request(app)
            .post("/api/v1/users/add_to_activity")
            .send({ token, meeting_code: "code888" });

        await request(app).post("/api/v1/meeting/mark-started/code888");

        const firstHistory = await request(app)
            .get("/api/v1/users/get_all_activity")
            .query({ token });
        const firstStartedAt = firstHistory.body[0].startedAt;

        // wait a bit and call mark-started again
        await new Promise((r) => setTimeout(r, 50));
        await request(app).post("/api/v1/meeting/mark-started/code888");

        const secondHistory = await request(app)
            .get("/api/v1/users/get_all_activity")
            .query({ token });
        const secondStartedAt = secondHistory.body[0].startedAt;

        expect(firstStartedAt).toBe(secondStartedAt); // wasn't overwritten
    });
});

describe("GET /api/v1/users/get_all_activity", () => {
    it("should return only the logged-in user's meetings", async () => {
        const tokenA = await registerAndLogin("userA");
        const tokenB = await registerAndLogin("userB");

        await request(app)
            .post("/api/v1/users/add_to_activity")
            .send({ token: tokenA, meeting_code: "meetingA" });

        await request(app)
            .post("/api/v1/users/add_to_activity")
            .send({ token: tokenB, meeting_code: "meetingB" });

        const resA = await request(app)
            .get("/api/v1/users/get_all_activity")
            .query({ token: tokenA });

        expect(resA.body.length).toBe(1);
        expect(resA.body[0].meetingCode).toBe("meetingA");
    });
});