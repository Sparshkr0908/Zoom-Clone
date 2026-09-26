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

describe("POST /api/v1/users/register", () => {
    it("should register a new user successfully", async () => {
        const res = await request(app)
            .post("/api/v1/users/register")
            .send({ name: "Test User", username: "testuser1", password: "password123" });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User Register");
    });

    it("should reject registration with short password", async () => {
        const res = await request(app)
            .post("/api/v1/users/register")
            .send({ name: "Test User", username: "testuser2", password: "short" });

        expect(res.statusCode).toBe(400);
    });

    it("should reject duplicate username", async () => {
        await request(app)
            .post("/api/v1/users/register")
            .send({ name: "Test User", username: "dupuser", password: "password123" });

        const res = await request(app)
            .post("/api/v1/users/register")
            .send({ name: "Another User", username: "dupuser", password: "password456" });

        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("User already exists");
    });

    it("should reject missing fields", async () => {
        const res = await request(app)
            .post("/api/v1/users/register")
            .send({ username: "onlyusername" });

        expect(res.statusCode).toBe(400);
    });
});

describe("POST /api/v1/users/login", () => {
    beforeEach(async () => {
        await request(app)
            .post("/api/v1/users/register")
            .send({ name: "Login User", username: "loginuser", password: "password123" });
    });

    it("should login with correct credentials and return a token", async () => {
        const res = await request(app)
            .post("/api/v1/users/login")
            .send({ username: "loginuser", password: "password123" });

        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it("should reject wrong password", async () => {
        const res = await request(app)
            .post("/api/v1/users/login")
            .send({ username: "loginuser", password: "wrongpassword" });

        expect(res.statusCode).toBe(401);
    });

    it("should reject non-existent username", async () => {
        const res = await request(app)
            .post("/api/v1/users/login")
            .send({ username: "ghostuser", password: "password123" });

        expect(res.statusCode).toBe(404);
    });
});

describe("GET /api/v1/users/verify", () => {
    let token;

    beforeEach(async () => {
        await request(app)
            .post("/api/v1/users/register")
            .send({ name: "Verify User", username: "verifyuser", password: "password123" });

        const loginRes = await request(app)
            .post("/api/v1/users/login")
            .send({ username: "verifyuser", password: "password123" });

        token = loginRes.body.token;
    });

    it("should confirm a valid token", async () => {
        const res = await request(app)
            .get("/api/v1/users/verify")
            .query({ token });

        expect(res.statusCode).toBe(200);
        expect(res.body.valid).toBe(true);
    });

    it("should reject an invalid token", async () => {
        const res = await request(app)
            .get("/api/v1/users/verify")
            .query({ token: "fake-token-123" });

        expect(res.statusCode).toBe(401);
        expect(res.body.valid).toBe(false);
    });

    it("should reject a missing token", async () => {
        const res = await request(app).get("/api/v1/users/verify");

        expect(res.statusCode).toBe(401);
    });
});