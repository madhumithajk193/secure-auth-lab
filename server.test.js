const request = require("supertest");
const app = require("./server");

describe("Secure Authentication Lab", () => {

    const email = `test-${Date.now()}@example.com`;
    const password = "MyPassword123";

    test("registers a new user", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                email,
                password
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Registration successful");
    });

    test("logs in with correct credentials", async () => {
        const agent = request.agent(app);

        const response = await agent
            .post("/login")
            .send({
                email,
                password
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Login successful");
    });

    test("rejects incorrect password with generic error", async () => {
        const response = await request(app)
            .post("/login")
            .send({
                email,
                password: "WrongPassword123"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toBe("Invalid email or password");
    });

    test("rejects invalid email format", async () => {
        const response = await request(app)
            .post("/register")
            .send({
                email: "not-an-email",
                password: "MyPassword123"
            });

        expect(response.statusCode).toBe(400);
    });

    test("logout works", async () => {
        const agent = request.agent(app);

        await agent
            .post("/login")
            .send({
                email,
                password
            });

        const response = await agent
            .post("/logout");

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Logout successful");
    });

});