const bcrypt = require("bcrypt");

const password = "MyPassword123";

async function testHash() {
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Original password:", password);
    console.log("Hashed password:", hashedPassword);

    const isCorrect = await bcrypt.compare(password, hashedPassword);

    console.log("Password matches:", isCorrect);
}

testHash();