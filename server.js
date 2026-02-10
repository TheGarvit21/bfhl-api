const express = require("express");
const axios = require("axios");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const EMAIL = process.env.OFFICIAL_EMAIL;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const getFibonacci = (n) => {
    if (n <= 0) return [];
    if (n === 1) return [0];
    let arr = [0, 1];
    for (let i = 2; i < n; i++) {
        arr.push(arr[i - 1] + arr[i - 2]);
    }
    return arr.slice(0, n);
};

const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcmTwo = (a, b) => (a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b));

app.get("/health", (req, res) => {
    res.status(200).json({
        is_success: true,
        official_email: EMAIL,
    });
});

app.post("/bfhl", async (req, res) => {
    try {
        const body = req.body;
        const keys = Object.keys(body);

        if (keys.length !== 1) {
            return res.status(400).json({
                is_success: false,
                message: "Request must contain exactly one valid operation key",
            });
        }

        const key = keys[0];
        let result;

        switch (key) {
            case "fibonacci":
                if (typeof body.fibonacci !== 'number' || body.fibonacci < 0) {
                    return res.status(400).json({ is_success: false, message: "Invalid input for fibonacci" });
                }
                result = getFibonacci(body.fibonacci);
                break;

            case "prime":
                if (!Array.isArray(body.prime)) {
                    return res.status(400).json({ is_success: false, message: "Input must be an array for prime check" });
                }
                result = body.prime.filter(n => typeof n === 'number' && isPrime(n));
                break;

            case "lcm":
                if (!Array.isArray(body.lcm) || body.lcm.length < 2) {
                    return res.status(400).json({ is_success: false, message: "Input must be an array of numbers for lcm" });
                }
                result = body.lcm.reduce((a, b) => lcmTwo(a, b));
                break;

            case "hcf":
                if (!Array.isArray(body.hcf) || body.hcf.length < 2) {
                    return res.status(400).json({ is_success: false, message: "Input must be an array of numbers for hcf" });
                }
                result = body.hcf.reduce((a, b) => gcd(a, b));
                break;

            case "AI":
                if (typeof body.AI !== 'string') {
                    return res.status(400).json({ is_success: false, message: "AI query must be a valid string" });
                }
                const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
                try {
                    const aiResponse = await model.generateContent(body.AI + " (Answer in exactly one word)");
                    const text = aiResponse.response.text();
                    result = text.trim().split(/\s+/)[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                } catch (aiErr) {
                    return res.status(500).json({ is_success: false, message: "AI provider integration error" });
                }
                break;

            default:
                return res.status(400).json({ is_success: false, message: "Unsupported operation" });
        }

        res.json({
            is_success: true,
            official_email: EMAIL,
            data: result,
        });

    } catch (err) {
        res.status(500).json({
            is_success: false,
            message: "Internal server error",
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server optimized and running on port ${PORT}`));
