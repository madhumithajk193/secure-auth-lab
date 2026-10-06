require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const app = express();
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        error: "Too many login attempts. Please try again later."
    }
});
app.use(session({
  secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 15 * 60 * 1000
    }
}));
app.use(express.json());

const users = [];

app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            error: "Invalid email or password"
        });
    }

    if (!password || password.length < 8) {
        return res.status(400).json({
            error: "Invalid email or password"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
        email: email,
        password: hashedPassword
    });

    res.status(201).json({
        message: "Registration successful"
    });
});
app.post("/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatches) {
        return res.status(401).json({
            error: "Invalid email or password"
        });
    }

    req.session.userId = user.email;

res.json({
    message: "Login successful"
});
});
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                error: "Logout failed"
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            message: "Logout successful"
        });
    });
});
app.get("/", (req, res) => {
    res.send("Secure Authentication Lab");
});

if (require.main === module) {
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
}

module.exports = app;